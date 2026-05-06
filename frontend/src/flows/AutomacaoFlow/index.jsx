import React, { useState, useEffect } from 'react'
import { getPacotes, getServicos, calcularAutomacao } from '../../services/api'
import PackageCards from './PackageCards'
import CustomBuilder from './CustomBuilder'
import ResultPanel from '../../components/ResultPanel'

export default function AutomacaoFlow({ cidade, multiplicador, onBack, isComboMode = false, onComboResult }) {
  const [tab, setTab] = useState('pacote')
  const [pacotes, setPacotes] = useState([])
  const [servicos, setServicos] = useState([])
  const [selectedPacote, setSelectedPacote] = useState(null)
  const [selectedServicos, setSelectedServicos] = useState([])
  const [extrasDoPlano, setExtrasDoPlano] = useState([]) // extras adicionados ao pacote selecionado
  const [numFuncionarios, setNumFuncionarios] = useState(1)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([getPacotes(multiplicador), getServicos(multiplicador)])
      .then(([pacs, servs]) => {
        // Enriquecer pacotes com _soma_avulso e servicos_ids para o PackageCards
        const pacotesEnriquecidos = pacs.map((p) => {
          const idsNoPacote = p.servicos_ids || []
          const somaAvulso = idsNoPacote.reduce((sum, id) => {
            const s = servs.find((sv) => sv.id === id)
            return sum + (s?.preco_final || 0)
          }, 0)
          return { ...p, _soma_avulso: somaAvulso }
        })
        setPacotes(pacotesEnriquecidos)
        setServicos(servs)
      })
      .finally(() => setLoading(false))
  }, [multiplicador])

  const handleSelectPacote = (id) => {
    setSelectedPacote(id)
    setExtrasDoPlano([]) // limpa extras ao trocar de pacote
  }

  const toggleExtra = (id) => {
    setExtrasDoPlano((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const toggleServico = (id) => {
    setSelectedServicos((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const handleFuncionarios = (delta) => {
    setNumFuncionarios((prev) => Math.max(1, prev + delta))
  }

  const handleCalcular = async () => {
    setCalculating(true)
    try {
      let payload
      if (tab === 'pacote') {
        const temExtras = extrasDoPlano.length > 0
        payload = {
          cidade,
          multiplicador_cidade: multiplicador,
          modo: temExtras ? 'pacote_personalizado' : 'pacote',
          pacote_id: selectedPacote,
          extra_servicos_ids: temExtras ? extrasDoPlano : undefined,
          num_funcionarios: numFuncionarios,
        }
      } else {
        payload = {
          cidade,
          multiplicador_cidade: multiplicador,
          modo: 'personalizado',
          servicos_ids: selectedServicos,
          num_funcionarios: numFuncionarios,
        }
      }

      const res = await calcularAutomacao(payload)

      if (isComboMode) {
        onComboResult({
          ...res,
          _pacote_id: selectedPacote,
          _servicos_ids: selectedServicos,
        })
      } else {
        setResultado(res)
      }
    } finally {
      setCalculating(false)
    }
  }

  const canProceed = tab === 'pacote' ? !!selectedPacote : selectedServicos.length > 0
  const acrescimoEquipe = numFuncionarios > 1 ? Math.round((numFuncionarios - 1) * 2) : 0

  if (resultado) {
    return <ResultPanel tipo="automacao" resultado={resultado} onReset={() => setResultado(null)} />
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">🤖 Automação com IA para Clínicas</h2>
          <p className="text-gray-500">Escolha um pacote ou monte o seu próprio conjunto de serviços.</p>
        </div>

        {/* Stepper de funcionários */}
        <div className="mb-6 bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="font-semibold text-gray-800 text-sm">👥 Quantos funcionários trabalham na clínica?</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {numFuncionarios === 1
                ? 'Sem acréscimo para 1 pessoa'
                : `+${acrescimoEquipe}% sobre setup e mensalidade (${numFuncionarios - 1} pessoa${numFuncionarios - 1 > 1 ? 's' : ''} adicional${numFuncionarios - 1 > 1 ? 'is' : ''})`}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleFuncionarios(-1)}
              disabled={numFuncionarios <= 1}
              className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              −
            </button>
            <span className="w-8 text-center text-xl font-bold text-gray-900">{numFuncionarios}</span>
            <button
              onClick={() => handleFuncionarios(1)}
              className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              +
            </button>
            {numFuncionarios > 1 && (
              <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg">
                +{acrescimoEquipe}%
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab('pacote')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'pacote' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📦 Pacotes
          </button>
          <button
            onClick={() => setTab('personalizado')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'personalizado' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ⚙️ Do zero
          </button>
        </div>

        {tab === 'pacote' && (
          <PackageCards
            pacotes={pacotes}
            servicos={servicos}
            selected={selectedPacote}
            onSelect={handleSelectPacote}
            extras={extrasDoPlano}
            onToggleExtra={toggleExtra}
            numFuncionarios={numFuncionarios}
          />
        )}

        {tab === 'personalizado' && (
          <CustomBuilder servicos={servicos} selected={selectedServicos} onToggle={toggleServico} />
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-gray-600 border-2 border-gray-200 hover:border-gray-300 font-semibold transition-all"
          >
            ← Voltar
          </button>
          <button
            onClick={handleCalcular}
            disabled={!canProceed || calculating}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {calculating ? '⏳ Calculando...' : isComboMode ? 'Próximo: Site →' : 'Ver Resultado →'}
          </button>
        </div>
      </div>
    </div>
  )
}
