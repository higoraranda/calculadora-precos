import React, { useState } from 'react'

export default function ProposalModal({ texto, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(texto)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">📋 Proposta Gerada</h2>
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
            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-green-500 hover:bg-green-600 text-white transition-all"
          >
            💬 Enviar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
