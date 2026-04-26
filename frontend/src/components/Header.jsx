import React from 'react'

const modeConfig = {
  automacao: { label: 'Automação com IA', icon: '🤖', color: 'bg-blue-600' },
  site: { label: 'Criação de Site', icon: '🌐', color: 'bg-green-600' },
  combo: { label: 'Combo Automação + Site', icon: '🎯', color: 'bg-amber-600' },
}

export default function Header({ mode, cidade, onBack, onHome }) {
  const cfg = mode ? modeConfig[mode] : null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onClick={onHome}
          className="text-gray-500 hover:text-gray-800 font-semibold text-lg transition-colors"
          title="Início"
        >
          🏠
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm transition-colors"
          >
            ← Voltar
          </button>
        )}
        <div className="flex-1" />
        {cfg && (
          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
        )}
        {cidade && (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
            📍 {cidade}
          </span>
        )}
      </div>
    </header>
  )
}
