import React, { useState } from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

// Calcula o setup personalizado mantendo o mesmo % de desconto do pacote base
function calcSetupPersonalizado(pacote, extrasServicos) {
  if (!extrasServicos.length) return { setup: pacote.setup_final, economia: pacote.economia }
  const somaExtras = extrasServicos.reduce((s, sv) => s + sv.preco_final, 0)
  const novaAvulso = pacote._soma_avulso + somaExtras
  const discountRatio = pacote._soma_avulso > 0 ? pacote.setup_final / pacote._soma_avulso : 1
  const novoSetup = Math.round((novaAvulso * discountRatio) / 10) * 10
  const economia = Math.max(0, novaAvulso - novoSetup)
  return { setup: novoSetup, economia }
}

export default function PackageCards({ pacotes, servicos, selected, onSelect, extras, onToggleExtra }) {
  const [expandido, setExpandido] = useState(null)

  const handleSelect = (id) => {
    onSelect(id)
    setExpandido(id)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pacotes.map((p) => {
          const isSelected = selected === p.id
          const extrasDoPlano = isSelected
            ? servicos.filter((s) => extras.includes(s.id) && !p.servicos_ids?.includes(s.id))
            : []
          const { setup: setupFinal, economia } = isSelected && extrasDoPlano.length
            ? calcSetupPersonalizado(p, extrasDoPlano)
            : { setup: p.setup_final, economia: p.economia }

          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`relative rounded-xl border p-5 text-left shadow-card transition-all hover:shadow-glow ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : p.destaque
                  ? 'border-primary/40 bg-card'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              {p.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-glow">
                  ⭐ MAIS POPULAR
                </span>
              )}
              <h3 className="mb-1 text-lg font-bold text-foreground">{p.nome}</h3>
              <div className="mb-1 text-2xl font-bold text-primary tabular">{fmt(setupFinal)}</div>
              <div className="mb-3 text-sm text-muted-foreground tabular">{fmt(p.mensalidade_final)}/mês</div>
              {economia > 0 && (
                <div className="mb-3 rounded-lg bg-success/15 px-2 py-1 text-xs font-medium text-success">
                  💎 Economize {fmt(economia)}
                </div>
              )}
              <ul className="space-y-1">
                {p.servicos.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-0.5 flex-shrink-0 text-primary">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
                {isSelected && extrasDoPlano.map((s) => (
                  <li key={s.id} className="flex items-start gap-2 text-xs font-medium text-primary">
                    <span className="mt-0.5 flex-shrink-0 text-primary">+</span>
                    <span>{s.nome}</span>
                  </li>
                ))}
              </ul>
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Painel de personalização */}
      {selected && (() => {
        const pacoteSel = pacotes.find((p) => p.id === selected)
        if (!pacoteSel) return null
        const idsNoPacote = new Set(pacoteSel.servicos_ids || [])
        const servicosExtras = servicos.filter((s) => !idsNoPacote.has(s.id))
        const extrasAtivos = servicos.filter((s) => extras.includes(s.id) && !idsNoPacote.has(s.id))
        const { setup: setupAtual, economia: economiaAtual } = extrasAtivos.length
          ? calcSetupPersonalizado(pacoteSel, extrasAtivos)
          : { setup: pacoteSel.setup_final, economia: pacoteSel.economia }
        const descPct = pacoteSel._soma_avulso > 0
          ? Math.round((1 - pacoteSel.setup_final / pacoteSel._soma_avulso) * 1000) / 10
          : 0

        return (
          <div className="rounded-xl border border-primary/30 bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground">✏️ Personalizar plano {pacoteSel.nome}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Adicione serviços extras mantendo o desconto de <strong className="text-foreground">{descPct}%</strong> do pacote
                </p>
              </div>
              {extrasAtivos.length > 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold text-primary tabular">{fmt(setupAtual)}</div>
                  <div className="text-xs font-medium text-success">💎 Economiza {fmt(economiaAtual)}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {servicosExtras.map((s) => {
                const isOn = extras.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={(e) => { e.stopPropagation(); onToggleExtra(s.id) }}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left transition-all ${
                      isOn ? 'border-primary bg-primary/10' : 'border-border bg-muted/40 hover:border-primary/40'
                    }`}
                  >
                    <span className="text-sm leading-tight text-foreground">{s.nome}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs font-semibold text-primary tabular">{fmt(s.preco_final)}</span>
                      <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${isOn ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                        {isOn && <span className="text-xs font-bold text-primary-foreground">✓</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {extrasAtivos.length === 0 && (
              <p className="py-2 text-center text-sm text-muted-foreground">
                Selecione serviços acima para personalizar o plano.
              </p>
            )}
          </div>
        )
      })()}
    </div>
  )
}
