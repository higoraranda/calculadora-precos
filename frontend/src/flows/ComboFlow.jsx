import React, { useState } from 'react'
import AutomacaoFlow from './AutomacaoFlow'
import SiteFlow from './SiteFlow'
import ResultPanel from '../components/ResultPanel'
import { calcularCombo } from '../services/api'

export default function ComboFlow({ cidade, multiplicador, onBack, clientInfo }) {
  const [phase, setPhase] = useState('automacao') // 'automacao' | 'site' | 'result'
  const [automacaoPayload, setAutomacaoPayload] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  // AutomacaoFlow in combo mode returns the calculated result + raw payload info
  const handleAutomacaoResult = (res) => {
    setAutomacaoPayload(res)
    setPhase('site')
  }

  // SiteFlow in combo mode returns { ...apiResult, _form: formData }
  const handleSiteResult = async (resSite) => {
    setLoading(true)
    try {
      const siteForm = resSite._form

      // Rebuild automacao payload for combo endpoint
      const autPayload = {
        cidade,
        multiplicador_cidade: multiplicador,
        modo: automacaoPayload.modo,
        pacote_id: automacaoPayload.modo === 'pacote' ? automacaoPayload._pacote_id : undefined,
        servicos_ids:
          automacaoPayload.modo === 'personalizado' ? automacaoPayload._servicos_ids : undefined,
      }

      const comboReq = {
        automacao: autPayload,
        site: {
          cidade,
          multiplicador_cidade: multiplicador,
          tipo_id: siteForm.tipo_id,
          total_paginas: siteForm.total_paginas,
          design_id: siteForm.design_id,
          funcionalidades_ids: siteForm.funcionalidades_ids,
          conteudo_id: siteForm.conteudo_id,
          banco_imagens: siteForm.banco_imagens,
          prazo_id: siteForm.prazo_id,
          plano_id: siteForm.plano_id,
        },
      }

      const res = await calcularCombo(comboReq)
      setResultado(res)
      setPhase('result')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPhase('automacao')
    setResultado(null)
    setAutomacaoPayload(null)
  }

  if (phase === 'result' && resultado) {
    return <ResultPanel tipo="combo" resultado={resultado} onReset={handleReset} clientInfo={clientInfo} />
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
        <p className="text-gray-500 text-sm">Calculando combo com desconto…</p>
      </div>
    )
  }

  return (
    <>
      {/* Combo progress banner */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-amber-50 border-b border-amber-200 py-2 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 text-sm font-semibold ${phase === 'automacao' ? 'text-amber-700' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${phase === 'automacao' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}`}>
              {phase === 'automacao' ? '1' : '✓'}
            </span>
            Automação com IA
          </div>
          <span className="text-gray-300">→</span>
          <div className={`flex items-center gap-2 text-sm font-semibold ${phase === 'site' ? 'text-amber-700' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${phase === 'site' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </span>
            Criação de Site
          </div>
          <span className="ml-4 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
            🎁 10% OFF no setup total
          </span>
        </div>
      </div>

      {/* Extra top padding for the banner */}
      <div className="pt-8">
        {phase === 'automacao' && (
          <AutomacaoFlow
            cidade={cidade}
            multiplicador={multiplicador}
            onBack={onBack}
            isComboMode={true}
            onComboResult={handleAutomacaoResult}
          />
        )}
        {phase === 'site' && (
          <SiteFlow
            cidade={cidade}
            multiplicador={multiplicador}
            onBack={() => setPhase('automacao')}
            isComboMode={true}
            onComboResult={handleSiteResult}
          />
        )}
      </div>
    </>
  )
}
