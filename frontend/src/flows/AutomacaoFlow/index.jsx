import React, { useState, useEffect } from 'react'
import { getPacotes, getServicos, calcularAutomacao } from '../../services/api'
import PackageCards from './PackageCards'
import CustomBuilder from './CustomBuilder'
import ResultPanel from '../../components/ResultPanel'

export default function AutomacaoFlow({ cidade, multiplicador, onBack, isComboMode = false, onComboResult, clientInfo }) {
  const [tab, setTab] = useState('pacote')
  const [pacotes, setPacotes] = useState([])
  const [servicos, setServicos] = useState([])
  const [selectedPacote, setSelectedPacote] = useState(null)
  const [selectedServicos, setSelectedServicos] = useState([])
  const [extrasDoPlano, setExtrasDoPlano] = useState([]) // extras adicionados ao pacote selecionado
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
        }
      } else {
        payload = {
          cidade,
          multiplicador_cidade: multiplicador,
          modo: 'personalizado',
          servicos_ids: selectedServicos,
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

  if (resultado) {
    return <ResultPanel tipo="automacao" resultado={resultado} onReset={() => setResultado(null)} clientInfo={clientInfo} />
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    )
  }

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-4xl animate-fade-in">
        <div className="mb-8">
          <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">🤖 Automação com IA para Clínicas</h2>
          <p className="text-muted-foreground">Escolha um pacote ou monte o seu próprio conjunto de serviços.</p>
        </div>

        <div className="mb-6 flex w-fit gap-1 rounded-xl border border-border bg-muted p-1">
          <button
            onClick={() => setTab('pacote')}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${tab === 'pacote' ? 'bg-card text-primary shadow-soft' : 'text-muted-foreground hover:text-foreground'}`}
          >
            📦 Pacotes
          </button>
          <button
            onClick={() => setTab('personalizado')}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${tab === 'personalizado' ? 'bg-card text-primary shadow-soft' : 'text-muted-foreground hover:text-foreground'}`}
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
          />
        )}

        {tab === 'personalizado' && (
          <CustomBuilder servicos={servicos} selected={selectedServicos} onToggle={toggleServico} />
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            className="rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all hover:bg-muted"
          >
            ← Voltar
          </button>
          <button
            onClick={handleCalcular}
            disabled={!canProceed || calculating}
            className="rounded-lg gradient-primary px-8 py-3 font-bold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {calculating ? '⏳ Calculando...' : isComboMode ? 'Próximo: Site →' : 'Ver Resultado →'}
          </button>
        </div>
      </div>
    </div>
  )
}
