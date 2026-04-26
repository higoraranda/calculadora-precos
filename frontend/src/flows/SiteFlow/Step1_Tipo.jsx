import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

const icons = {
  landing_page: '🎯',
  site_institucional: '🏢',
  blog_portal: '📰',
  ecommerce: '🛒',
  sistema_web: '⚙️',
  portfolio: '🎨',
  site_evento: '🎪',
}

export default function Step1_Tipo({ tipos, value, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Qual o tipo de projeto?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tipos.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              value === t.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>{icons[t.id] || '🌐'}</span>
                  {t.nome}
                </div>
                {t.descricao && (
                  <div className="text-xs text-gray-500 mt-0.5">{t.descricao}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {t.paginas_inclusas} página{t.paginas_inclusas > 1 ? 's' : ''} inclusa
                  {t.paginas_inclusas > 1 ? 's' : ''}
                  <span className="ml-2 text-gray-300">|</span>
                  <span className="ml-2">extra: {fmt(t.preco_pagina_extra)}/pág</span>
                </div>
              </div>
              <div className="text-green-700 font-bold text-base shrink-0">{fmt(t.preco_base)}</div>
            </div>
            {value === t.id && (
              <div className="absolute top-0 right-0 w-5 h-5" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
