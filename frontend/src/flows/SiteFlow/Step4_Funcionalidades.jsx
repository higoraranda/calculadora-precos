import React, { useState } from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function Step4_Funcionalidades({ funcionalidades, selected, onToggle }) {
  const [search, setSearch] = useState('')

  const filtered = funcionalidades.filter((f) =>
    f.nome.toLowerCase().includes(search.toLowerCase())
  )

  const total = funcionalidades
    .filter((f) => selected.includes(f.id))
    .reduce((sum, f) => sum + f.preco_base, 0)

  return (
    <div>
      <h3 className="mb-1 text-lg font-bold text-foreground">Funcionalidades extras</h3>
      <p className="mb-3 text-sm text-muted-foreground">
        Selecione os recursos que o projeto precisará. Deixe em branco se não houver extras.
      </p>

      <input
        type="text"
        placeholder="🔍 Pesquisar funcionalidade..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/30"
      />

      <div className="mb-4 grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {filtered.map((f) => {
          const isOn = selected.includes(f.id)
          return (
            <button
              key={f.id}
              onClick={() => onToggle(f.id)}
              className={`flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left transition-all ${
                isOn
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="text-sm leading-tight text-foreground">{f.nome}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-semibold text-primary tabular">{fmt(f.preco_base)}</span>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                    isOn ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                  }`}
                >
                  {isOn && <span className="text-xs font-bold text-primary-foreground">✓</span>}
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="col-span-2 py-4 text-center text-sm text-muted-foreground">
            Nenhuma funcionalidade encontrada.
          </p>
        )}
      </div>

      {selected.length > 0 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm font-medium text-primary">
          {selected.length} funcionalidade{selected.length > 1 ? 's' : ''} selecionada
          {selected.length > 1 ? 's' : ''} • Total:{' '}
          <strong>{fmt(total)}</strong>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
          Nenhuma funcionalidade extra selecionada (pode pular esta etapa).
        </div>
      )}
    </div>
  )
}
