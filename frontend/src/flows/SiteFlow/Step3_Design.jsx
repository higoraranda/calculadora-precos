import React from 'react'

const stars = { simples: 1, intermediario: 2, avancado: 3, premium: 4 }
const colors = {
  simples: 'text-gray-500',
  intermediario: 'text-blue-500',
  avancado: 'text-purple-500',
  premium: 'text-amber-500',
}

export default function Step3_Design({ designs, value, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Nível de complexidade do design</h3>
      <div className="space-y-3">
        {designs.map((d) => (
          <button
            key={d.id}
            onClick={() => onChange(d.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              value === d.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-semibold text-gray-900 flex items-center gap-2`}>
                  <span className={colors[d.id]}>{'★'.repeat(stars[d.id] || 1)}{'☆'.repeat(4 - (stars[d.id] || 1))}</span>
                  {d.nome}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">{d.descricao}</div>
              </div>
              <div
                className={`text-sm font-bold px-3 py-1 rounded-full shrink-0 ml-3 ${
                  d.multiplicador > 1
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {d.multiplicador === 1.0
                  ? 'Base'
                  : `×${d.multiplicador} (+${Math.round((d.multiplicador - 1) * 100)}%)`}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
