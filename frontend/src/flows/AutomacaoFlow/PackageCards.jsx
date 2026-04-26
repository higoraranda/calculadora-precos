import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function PackageCards({ pacotes, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pacotes.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`relative text-left p-5 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md ${
            selected === p.id
              ? 'border-blue-500 bg-blue-50'
              : p.destaque
              ? 'border-indigo-300 bg-white'
              : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
        >
          {p.destaque && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              ⭐ MAIS POPULAR
            </span>
          )}
          <h3 className="font-bold text-lg text-gray-900 mb-1">{p.nome}</h3>
          <div className="text-2xl font-bold text-blue-700 mb-1">{fmt(p.setup_final)}</div>
          <div className="text-sm text-gray-500 mb-3">{fmt(p.mensalidade_final)}/mês</div>
          {p.economia > 0 && (
            <div className="text-xs bg-green-100 text-green-700 rounded-lg px-2 py-1 mb-3 font-medium">
              💎 Economize {fmt(p.economia)}
            </div>
          )}
          <ul className="space-y-1">
            {p.servicos.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          {selected === p.id && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
