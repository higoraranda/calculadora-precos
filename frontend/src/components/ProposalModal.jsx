import React, { useState } from 'react'

export default function ProposalModal({ texto, clientInfo, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(texto)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const digits = (clientInfo?.telefone || '').replace(/\D/g, '')
    const numero = digits.length >= 10 ? `55${digits}` : ''
    const url = numero
      ? `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
      : `https://wa.me/?text=${encodeURIComponent(texto)}`
    window.open(url, '_blank')
  }

  const temTelefone = (clientInfo?.telefone || '').replace(/\D/g, '').length >= 10

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">📋 Proposta Gerada</h2>
            {clientInfo?.nome && (
              <p className="text-sm text-gray-500 mt-0.5">Cliente: <strong>{clientInfo.nome}</strong></p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>

        <pre className="flex-1 overflow-auto p-6 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{texto}</pre>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              copied ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {copied ? '✅ Copiado!' : '📋 Copiar texto'}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-green-500 hover:bg-green-600 text-white transition-all flex items-center justify-center gap-2"
          >
            <span>💬</span>
            <span>
              {temTelefone
                ? `Enviar para ${clientInfo.nome || 'cliente'}`
                : 'Enviar no WhatsApp'}
            </span>
          </button>
        </div>

        {temTelefone && (
          <div className="px-6 pb-4 text-xs text-gray-400 text-center">
            Abrirá conversa com {clientInfo.telefone} com a mensagem já preenchida
          </div>
        )}
      </div>
    </div>
  )
}
