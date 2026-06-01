import React, { useMemo } from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function CustomBuilder({ servicos, selected, onToggle }) {
  const totalSetup = useMemo(() => selected.reduce((sum, id) => {
    const s = servicos.find(sv => sv.id === id)
    return sum + (s?.preco_final || 0)
  }, 0), [selected, servicos])

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {servicos.map(s => {
          const isSelected = selected.includes(s.id)
          return (
            <button
              key={s.id}
              onClick={() => onToggle(s.id)}
              className={`rounded-lg border p-4 text-left transition-all ${
                isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium leading-tight text-foreground">{s.nome}</span>
                <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
                  isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                }`}>
                  {isSelected && <span className="text-xs text-primary-foreground">✓</span>}
                </div>
              </div>
              <span className="mt-1 block text-sm font-semibold text-primary tabular">{fmt(s.preco_final)}</span>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">{selected.length} serviço{selected.length > 1 ? 's' : ''} selecionado{selected.length > 1 ? 's' : ''}</span>
            <span className="text-lg font-bold text-primary tabular">Setup: {fmt(totalSetup)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
