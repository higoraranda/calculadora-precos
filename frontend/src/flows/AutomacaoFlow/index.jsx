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
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([getPacotes(multiplicador), getServicos(multiplicador)])
      .then(([pacs, servs]) => { setPacotes(pacs); setServicos(servs) })
      .finally(() => setLoading(false))
  }, [multiplicador])

  const toggleServico = (id) => {
    setSelectedServicos(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleCalcular = async () => {
    setCalculating(true)
    try {
      const payload = tab === 'pacote'
        ? { cidade, multiplicador_cidade: multiplicador, modo: 'pacote', pacote_id: selectedPacote }
        : { cidade, multiplicador_cidade: multiplicador, modo: 'personalizado', servicos_ids: selectedServicos }
      const res = await calcularAutomacao(payload)
      if (isComboMode) {
        // Attach raw selection info so ComboFlow can call /combo/calcular
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
    return <ResultPanel tipo="automacao" resultado={resultado} onReset={() => setResultado(null)} />
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">🤖 Automação com IA para Clínicas</h2>
          <p className="text-gray-500">Escolha um pacote ou monte o seu próprio conjunto de serviços.</p>
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
            ⚙️ Personalizado
          </button>
        </div>

        {tab === 'pacote' && (
          <PackageCards pacotes={pacotes} selected={selectedPacote} onSelect={setSelectedPacote} />
        )}

        {tab === 'personalizado' && (
          <CustomBuilder servicos={servicos} selected={selectedServicos} onToggle={toggleServico} />
        )}

        <div className="mt-8 flex justify-between">
          <button onClick={onBack} className="px-6 py-3 rounded-xl text-gray-600 border-2 border-gray-200 hover:border-gray-300 font-semibold transition-all">
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
