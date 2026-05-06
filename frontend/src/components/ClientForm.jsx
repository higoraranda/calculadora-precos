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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👤</div>
          <h2 className="text-2xl font-bold text-gray-900">Dados do cliente</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Preencha para personalizar a proposta e facilitar o envio pelo WhatsApp.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nome do cliente <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              WhatsApp do cliente <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => handleTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              Se preenchido, o botão WhatsApp abrirá direto na conversa com o cliente.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onBack}
              className="px-5 py-3 rounded-xl text-gray-600 border-2 border-gray-200 hover:border-gray-300 font-semibold transition-all"
            >
              ← Voltar
            </button>
            <button
              onClick={() => onConfirm({ nome: nome.trim(), telefone })}
              disabled={!canProceed}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Começar cálculo →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
