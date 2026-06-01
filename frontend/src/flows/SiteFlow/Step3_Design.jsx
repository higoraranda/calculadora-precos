import React from 'react'

const stars = { simples: 1, intermediario: 2, avancado: 3, premium: 4 }

export default function Step3_Design({ designs, value, onChange }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-foreground">Nível de complexidade do design</h3>
      <div className="space-y-3">
        {designs.map((d) => (
          <button
            key={d.id}
            onClick={() => onChange(d.id)}
            className={`w-full rounded-lg border p-4 text-left transition-all ${
              value === d.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <span className="text-primary">{'★'.repeat(stars[d.id] || 1)}<span className="text-muted-foreground/30">{'☆'.repeat(4 - (stars[d.id] || 1))}</span></span>
                  {d.nome}
                </div>
                <div className="mt-0.5 text-sm text-muted-foreground">{d.descricao}</div>
              </div>
              <div
                className={`ml-3 shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                  d.multiplicador > 1
                    ? 'bg-warning/15 text-warning'
                    : 'bg-muted text-muted-foreground'
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
