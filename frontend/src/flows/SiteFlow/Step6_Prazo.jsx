import React from 'react'

const icons = { padrao: '🐢', acelerado: '🚀', urgente: '⚡' }

export default function Step6_Prazo({ prazos, value, onChange }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-foreground">Prazo de entrega</h3>
      <div className="space-y-3">
        {prazos.map((p) => {
          const isOn = value === p.id
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`w-full rounded-lg border p-4 text-left transition-all ${
                isOn ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icons[p.id] || '🐢'}</span>
                  <div>
                    <div className="font-semibold text-foreground">{p.nome}</div>
                    <div className="mt-0.5 text-sm font-medium text-muted-foreground">{p.descricao}</div>
                  </div>
                </div>
                <div
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    p.multiplicador > 1 ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'
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
      <p className="mt-4 text-xs text-muted-foreground">
        💡 O acréscimo de prazo urgente refere-se ao valor do setup (desenvolvimento), não à mensalidade.
      </p>
    </div>
  )
}
