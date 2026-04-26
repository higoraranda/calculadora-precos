import React, { useMemo } from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function CustomBuilder({ servicos, selected, onToggle }) {
  const totalSetup = useMemo(() => selected.reduce((sum, id) => {
    const s = servicos.find(sv => sv.id === id)
    return sum + (s?.preco_final || 0)
  }, 0), [selected, servicos])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {servicos.map(s => {
          const isSelected = selected.includes(s.id)
          return (
            <button
              key={s.id}
              onClick={() => onToggle(s.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-gray-800 leading-tight">{s.nome}</span>
                <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 ${
                  isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
              <span className="text-blue-700 font-semibold text-sm mt-1 block">{fmt(s.preco_final)}</span>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700 font-medium">{selected.length} serviço{selected.length > 1 ? 's' : ''} selecionado{selected.length > 1 ? 's' : ''}</span>
            <span className="text-lg font-bold text-blue-800">Setup: {fmt(totalSetup)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
