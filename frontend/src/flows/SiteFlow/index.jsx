import React, { useState, useEffect } from 'react'
import {
  getTiposSite,
  getFuncionalidades,
  getDesigns,
  getConteudos,
  getPrazos,
  getPlanosMensais,
  calcularSite,
  calcularLinktree,
} from '../../services/api'
import ResultPanel from '../../components/ResultPanel'
import Step1_Tipo from './Step1_Tipo'
import Step2_Paginas from './Step2_Paginas'
import Step3_Design from './Step3_Design'
import Step4_Funcionalidades from './Step4_Funcionalidades'
import Step5_Conteudo from './Step5_Conteudo'
import Step6_Prazo from './Step6_Prazo'
import Step7_PlanoMensal from './Step7_PlanoMensal'
import ResumoSite from './ResumoSite'

const STEP_LABELS = ['Tipo', 'Páginas', 'Design', 'Funcionalidades', 'Conteúdo', 'Prazo', 'Plano', 'Resumo']

const defaultForm = {
  tipo_id: null,
  total_paginas: 1,
  design_id: 'simples',
  funcionalidades_ids: [],
  conteudo_id: 'cliente_fornece',
  banco_imagens: false,
  prazo_id: 'padrao',
  plano_id: 'essencial',
}

function calcPreview(form, data, multiplicador) {
  if (!form.tipo_id || form.tipo_id === 'linktree') return 0
  const tipo = data.tipos.find((t) => t.id === form.tipo_id)
  const design = data.designs.find((d) => d.id === form.design_id)
  const conteudo = data.conteudos.find((c) => c.id === form.conteudo_id)
  const prazo = data.prazos.find((p) => p.id === form.prazo_id)
  if (!tipo || !design || !conteudo || !prazo) return 0

  const pagExtras = Math.max(0, form.total_paginas - tipo.paginas_inclusas)
  const somaFuncs = data.funcionalidades
    .filter((f) => form.funcionalidades_ids.includes(f.id))
    .reduce((s, f) => s + f.preco_base, 0)
  const precoCont = conteudo.por_pagina
    ? conteudo.preco_base * form.total_paginas
    : conteudo.preco_base
  const banco = form.banco_imagens ? 200 : 0
  const subtotal =
    tipo.preco_base + pagExtras * tipo.preco_pagina_extra + somaFuncs + precoCont + banco
  return Math.round((subtotal * design.multiplicador * prazo.multiplicador * multiplicador) / 10) * 10
}

export default function SiteFlow({
  cidade,
  multiplicador,
  onBack,
  isComboMode = false,
  onComboResult,
  clientInfo,
}) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(defaultForm)
  const [data, setData] = useState({
    tipos: [],
    funcionalidades: [],
    designs: [],
    conteudos: [],
    prazos: [],
    planos: [],
  })
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  // Carrega todos os dados estáticos na montagem (planos sem setup ainda)
  useEffect(() => {
    Promise.all([
      getTiposSite(),
      getFuncionalidades(),
      getDesigns(),
      getConteudos(),
      getPrazos(),
      getPlanosMensais(multiplicador, 0),
    ])
      .then(([tipos, funcs, designs, conteudos, prazos, planos]) => {
        setData({ tipos, funcionalidades: funcs, designs, conteudos, prazos, planos })
      })
      .finally(() => setLoading(false))
  }, [multiplicador])

  const isLinktree = form.tipo_id === 'linktree'
  const currentTipo = data.tipos.find((t) => t.id === form.tipo_id)
  const previewSetup = calcPreview(form, data, multiplicador)
  const currentPlano = data.planos.find((p) => p.id === form.plano_id)

  // Ao entrar na etapa do plano (step 6), re-busca os planos com o setup real
  useEffect(() => {
    if (step === 6 && previewSetup > 0) {
      getPlanosMensais(multiplicador, previewSetup).then((planos) => {
        setData((d) => ({ ...d, planos }))
      })
    }
  }, [step, previewSetup, multiplicador])

  const setField = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleTipoChange = (id) => {
    const t = data.tipos.find((tp) => tp.id === id)
    setForm((f) => ({ ...f, tipo_id: id, total_paginas: t ? t.paginas_inclusas : 1 }))
  }

  const toggleFunc = (id) =>
    setForm((f) => ({
      ...f,
      funcionalidades_ids: f.funcionalidades_ids.includes(id)
        ? f.funcionalidades_ids.filter((x) => x !== id)
        : [...f.funcionalidades_ids, id],
    }))

  const canNext = () => {
    if (step === 0) return !!form.tipo_id
    return true
  }

  const handleNext = async () => {
    // Linktree: pula o wizard inteiro e vai direto ao resultado
    if (step === 0 && isLinktree) {
      setCalculating(true)
      try {
        const res = await calcularLinktree({ cidade, multiplicador_cidade: multiplicador })
        if (isComboMode) {
          onComboResult({ ...res, _form: form })
        } else {
          setResultado(res)
        }
      } finally {
        setCalculating(false)
      }
      return
    }
    setStep((s) => Math.min(s + 1, 7))
  }

  const handleBack = () => {
    if (step === 0) onBack()
    else setStep((s) => s - 1)
  }

  const handleCalcular = async () => {
    setCalculating(true)
    try {
      const payload = {
        cidade,
        multiplicador_cidade: multiplicador,
        tipo_id: form.tipo_id,
        total_paginas: form.total_paginas,
        design_id: form.design_id,
        funcionalidades_ids: form.funcionalidades_ids,
        conteudo_id: form.conteudo_id,
        banco_imagens: form.banco_imagens,
        prazo_id: form.prazo_id,
        plano_id: form.plano_id,
      }
      const res = await calcularSite(payload)
      if (isComboMode) {
        onComboResult({ ...res, _form: form })
      } else {
        setResultado(res)
      }
    } finally {
      setCalculating(false)
    }
  }

  if (resultado)
    return (
      <ResultPanel
        tipo={resultado.is_linktree ? 'linktree' : 'site'}
        resultado={resultado}
        onReset={() => setResultado(null)}
        clientInfo={clientInfo}
      />
    )

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )

  const isLastStep = step === 7
  const showMensalidade = step >= 7 && currentPlano

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Progress bar — oculta quando linktree está selecionado no step 0 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">🌐 Criação de Site</h2>
              {!isLinktree && (
                <span className="text-sm text-gray-500 font-medium">
                  {step + 1}/{STEP_LABELS.length}
                </span>
              )}
            </div>
            {!isLinktree && (
              <>
                <div className="flex gap-1">
                  {STEP_LABELS.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                        i <= step ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">{STEP_LABELS[step]}</div>
              </>
            )}
          </div>

          {/* Step card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {step === 0 && (
              <Step1_Tipo tipos={data.tipos} value={form.tipo_id} onChange={handleTipoChange} />
            )}
            {step === 1 && (
              <Step2_Paginas
                tipo={currentTipo}
                value={form.total_paginas}
                onChange={setField('total_paginas')}
              />
            )}
            {step === 2 && (
              <Step3_Design
                designs={data.designs}
                value={form.design_id}
                onChange={setField('design_id')}
              />
            )}
            {step === 3 && (
              <Step4_Funcionalidades
                funcionalidades={data.funcionalidades}
                selected={form.funcionalidades_ids}
                onToggle={toggleFunc}
              />
            )}
            {step === 4 && (
              <Step5_Conteudo
                opcoes={data.conteudos}
                value={form.conteudo_id}
                totalPaginas={form.total_paginas}
                bancoImagens={form.banco_imagens}
                onChangeConteudo={setField('conteudo_id')}
                onChangeBanco={setField('banco_imagens')}
              />
            )}
            {step === 5 && (
              <Step6_Prazo
                prazos={data.prazos}
                value={form.prazo_id}
                onChange={setField('prazo_id')}
              />
            )}
            {step === 6 && (
              <Step7_PlanoMensal
                planos={data.planos}
                value={form.plano_id}
                onChange={setField('plano_id')}
              />
            )}
            {step === 7 && (
              <ResumoSite
                dados={form}
                tipos={data.tipos}
                designs={data.designs}
                funcionalidades={data.funcionalidades}
                conteudos={data.conteudos}
                prazos={data.prazos}
                planos={data.planos}
                onEdit={setStep}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl text-gray-600 border-2 border-gray-200 hover:border-gray-300 font-semibold transition-all"
              >
                ← Voltar
              </button>

              {/* Linktree no step 0: botão direto para resultado */}
              {step === 0 && isLinktree ? (
                <button
                  onClick={handleNext}
                  disabled={calculating}
                  className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {calculating ? '⏳ Calculando...' : isComboMode ? 'Próximo: Automação →' : '🔗 Ver Resultado →'}
                </button>
              ) : isLastStep ? (
                <button
                  onClick={handleCalcular}
                  disabled={calculating}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {calculating
                    ? '⏳ Calculando...'
                    : isComboMode
                    ? 'Ver Resultado Combo →'
                    : 'Ver Resultado →'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canNext()}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Avançar →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — live price preview */}
        <div className="hidden lg:block w-52 shrink-0">
          <div className={`sticky top-24 bg-white rounded-2xl shadow-lg p-4 border-2 ${isLinktree ? 'border-purple-100' : 'border-green-100'}`}>
            <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
              Investimento atual
            </div>

            {isLinktree ? (
              <>
                <div className="text-2xl font-bold text-purple-700">R$ 150</div>
                <div className="text-xs text-gray-400 mt-0.5">preço fixo</div>
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
                  🔗 Linktree sem mensalidade
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-700">
                  {form.tipo_id ? `R$ ${previewSetup.toLocaleString('pt-BR')}` : '—'}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">setup estimado</div>

                {showMensalidade && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-400">+ mensalidade</div>
                    <div className="text-base font-semibold text-gray-700">
                      R$ {(currentPlano.preco_final || 0).toLocaleString('pt-BR')}/mês
                    </div>
                    <div className="text-xs text-gray-400">{currentPlano.nome}</div>
                  </div>
                )}

                {step < 6 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
                    A mensalidade será calculada com base no valor do setup.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
