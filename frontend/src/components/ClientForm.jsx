import React, { useState } from 'react'

export default function ClientForm({ onConfirm, onBack }) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')

  // Formata telefone enquanto digita: (11) 99999-9999
  const handleTelefone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 11)
    let fmt = digits
    if (digits.length > 2) fmt = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length > 7) fmt = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    setTelefone(fmt)
  }

  const canProceed = nome.trim().length >= 2
  const inputCls =
    'w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30'

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-scale-in">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">👤</div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Dados do cliente</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha para personalizar a proposta e facilitar o envio pelo WhatsApp.
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
          {/* Nome */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Nome do cliente <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              className={inputCls}
              autoFocus
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              WhatsApp do cliente <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => handleTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Se preenchido, o botão WhatsApp abrirá direto na conversa com o cliente.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onBack}
              className="rounded-lg border border-border bg-card px-5 py-3 font-semibold text-foreground transition-all hover:bg-muted"
            >
              ← Voltar
            </button>
            <button
              onClick={() => onConfirm({ nome: nome.trim(), telefone })}
              disabled={!canProceed}
              className="flex-1 rounded-lg gradient-primary py-3 font-bold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Começar cálculo →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
