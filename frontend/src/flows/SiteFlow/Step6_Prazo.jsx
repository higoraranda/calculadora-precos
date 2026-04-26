import React from 'react'

const configs = {
  padrao: { icon: '🐢', color: 'text-green-600', bg: 'bg-green-50 border-green-200', badge: 'bg-gray-100 text-gray-600' },
  acelerado: { icon: '🚀', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  urgente: { icon: '⚡', color: 'text-red-600', bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700' },
}

export default function Step6_Prazo({ prazos, value, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Prazo de entrega</h3>
      <div className="space-y-3">
        {prazos.map((p) => {
          const cfg = configs[p.id] || configs.padrao
          const isOn = value === p.id
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isOn ? `border-green-500 ${cfg.bg}` : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cfg.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{p.nome}</div>
                    <div className={`text-sm font-medium mt-0.5 ${cfg.color}`}>{p.descricao}</div>
                  </div>
                </div>
                <div
                  className={`text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                    p.multiplicador > 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {p.multiplicador === 1.0
                    ? 'Sem acréscimo'
                    : `+${Math.round((p.multiplicador - 1) * 100)}% no setup`}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        💡 O acréscimo de prazo urgente refere-se ao valor do setup (desenvolvimento), não à mensalidade.
      </p>
    </div>
  )
}
