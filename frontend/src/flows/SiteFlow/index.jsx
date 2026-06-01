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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    )

  const isLastStep = step === 7
  const showMensalidade = step >= 7 && currentPlano

  return (
    <div className="px-4 py-12">
      <div className="mx-auto flex max-w-4xl gap-6 animate-fade-in">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Progress bar — oculta quando linktree está selecionado no step 0 */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">🌐 Criação de Site</h2>
              {!isLinktree && (
                <span className="text-sm font-medium text-muted-foreground">
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
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= step ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{STEP_LABELS[step]}</div>
              </>
            )}
          </div>

          {/* Step card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
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
            <div className="mt-6 flex justify-between border-t border-border pt-4">
              <button
                onClick={handleBack}
                className="rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all hover:bg-muted"
              >
                ← Voltar
              </button>

              {/* Linktree no step 0: botão direto para resultado */}
              {step === 0 && isLinktree ? (
                <button
                  onClick={handleNext}
                  disabled={calculating}
                  className="rounded-lg gradient-primary px-8 py-3 font-bold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {calculating ? '⏳ Calculando...' : isComboMode ? 'Próximo: Automação →' : '🔗 Ver Resultado →'}
                </button>
              ) : isLastStep ? (
                <button
                  onClick={handleCalcular}
                  disabled={calculating}
                  className="rounded-lg gradient-primary px-8 py-3 font-bold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="rounded-lg gradient-primary px-8 py-3 font-bold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Avançar →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — live price preview */}
        <div className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Investimento atual
            </div>

            {isLinktree ? (
              <>
                <div className="text-2xl font-bold text-primary tabular">R$ 150</div>
                <div className="mt-0.5 text-xs text-muted-foreground">preço fixo</div>
                <div className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                  🔗 Linktree sem mensalidade
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-primary tabular">
                  {form.tipo_id ? `R$ ${previewSetup.toLocaleString('pt-BR')}` : '—'}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">setup estimado</div>

                {showMensalidade && (
                  <div className="mt-3 border-t border-border pt-3">
                    <div className="text-xs text-muted-foreground">+ mensalidade</div>
                    <div className="text-base font-semibold text-foreground tabular">
                      R$ {(currentPlano.preco_final || 0).toLocaleString('pt-BR')}/mês
                    </div>
                    <div className="text-xs text-muted-foreground">{currentPlano.nome}</div>
                  </div>
                )}

                {step < 6 && (
                  <div className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
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
