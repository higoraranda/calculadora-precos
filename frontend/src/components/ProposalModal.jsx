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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-card shadow-card animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">📋 Proposta Gerada</h2>
            {clientInfo?.nome && (
              <p className="mt-0.5 text-sm text-muted-foreground">Cliente: <strong className="text-foreground">{clientInfo.nome}</strong></p>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg px-2 text-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">✕</button>
        </div>

        <pre className="flex-1 overflow-auto whitespace-pre-wrap p-6 font-sans text-sm leading-relaxed text-foreground/90">{texto}</pre>

        <div className="flex gap-3 border-t border-border p-6">
          <button
            onClick={handleCopy}
            className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all ${
              copied ? 'bg-success text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70'
            }`}
          >
            {copied ? '✅ Copiado!' : '📋 Copiar texto'}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.99]"
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
          <div className="px-6 pb-4 text-center text-xs text-muted-foreground">
            Abrirá conversa com {clientInfo.telefone} com a mensagem já preenchida
          </div>
        )}
      </div>
    </div>
  )
}
