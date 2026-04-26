import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function Step2_Paginas({ tipo, value, onChange }) {
  if (!tipo) return null
  const extras = Math.max(0, value - tipo.paginas_inclusas)
  const precoExtras = extras * tipo.preco_pagina_extra

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Quantas páginas no total?</h3>
      <p className="text-sm text-gray-500 mb-6">
        Tipo selecionado: <strong>{tipo.nome}</strong> —{' '}
        <strong>{tipo.paginas_inclusas} página{tipo.paginas_inclusas > 1 ? 's' : ''}</strong>{' '}
        inclusa{tipo.paginas_inclusas > 1 ? 's' : ''}.{' '}
        Páginas extras: <strong>{fmt(tipo.preco_pagina_extra)}</strong> cada.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-green-400 text-gray-600 font-bold text-xl transition-all flex items-center justify-center"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-2xl font-bold text-center outline-none transition-all"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-green-400 text-gray-600 font-bold text-xl transition-all flex items-center justify-center"
        >
          +
        </button>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
          <span>Páginas inclusas</span>
          <span className="font-semibold text-gray-800">{tipo.paginas_inclusas}</span>
        </div>
        {extras > 0 && (
          <div className="flex justify-between text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="text-green-700">
              +{extras} página{extras > 1 ? 's' : ''} extra{extras > 1 ? 's' : ''} × {fmt(tipo.preco_pagina_extra)}
            </span>
            <span className="font-bold text-green-800">{fmt(precoExtras)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
