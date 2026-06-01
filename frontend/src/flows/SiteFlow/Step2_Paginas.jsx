import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function Step2_Paginas({ tipo, value, onChange }) {
  if (!tipo) return null
  const extras = Math.max(0, value - tipo.paginas_inclusas)
  const precoExtras = extras * tipo.preco_pagina_extra

  return (
    <div>
      <h3 className="mb-2 text-lg font-bold text-foreground">Quantas páginas no total?</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Tipo selecionado: <strong className="text-foreground">{tipo.nome}</strong> —{' '}
        <strong className="text-foreground">{tipo.paginas_inclusas} página{tipo.paginas_inclusas > 1 ? 's' : ''}</strong>{' '}
        inclusa{tipo.paginas_inclusas > 1 ? 's' : ''}.{' '}
        Páginas extras: <strong className="text-foreground">{fmt(tipo.preco_pagina_extra)}</strong> cada.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-xl font-bold text-foreground transition-all hover:border-primary/50 hover:bg-muted"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 rounded-lg border border-input bg-background px-4 py-3 text-center text-2xl font-bold tabular text-foreground outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-xl font-bold text-foreground transition-all hover:border-primary/50 hover:bg-muted"
        >
          +
        </button>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          <span>Páginas inclusas</span>
          <span className="font-semibold text-foreground">{tipo.paginas_inclusas}</span>
        </div>
        {extras > 0 && (
          <div className="flex justify-between rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm">
            <span className="text-primary">
              +{extras} página{extras > 1 ? 's' : ''} extra{extras > 1 ? 's' : ''} × {fmt(tipo.preco_pagina_extra)}
            </span>
            <span className="font-bold text-primary tabular">{fmt(precoExtras)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
