import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

const icons = {
  landing_page: '🎯',
  site_institucional: '🏢',
  blog_portal: '📰',
  ecommerce: '🛒',
  sistema_web: '⚙️',
  portfolio: '🎨',
  site_evento: '🎪',
}

export default function Step1_Tipo({ tipos, value, onChange }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-foreground">Qual o tipo de projeto?</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tipos.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-lg border p-4 text-left transition-all ${
              value === t.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <span>{icons[t.id] || '🌐'}</span>
                  {t.nome}
                </div>
                {t.descricao && (
                  <div className="mt-0.5 text-xs text-muted-foreground">{t.descricao}</div>
                )}
                <div className="mt-1 text-xs text-muted-foreground">
                  {t.paginas_inclusas} página{t.paginas_inclusas > 1 ? 's' : ''} inclusa
                  {t.paginas_inclusas > 1 ? 's' : ''}
                  <span className="ml-2 text-muted-foreground/50">|</span>
                  <span className="ml-2">extra: {fmt(t.preco_pagina_extra)}/pág</span>
                </div>
              </div>
              <div className="shrink-0 text-base font-bold text-primary tabular">{fmt(t.preco_base)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Linktree — opção de preço fixo, sem wizard */}
      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Página simples</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <button
          onClick={() => onChange('linktree')}
          className={`w-full rounded-lg border p-4 text-left transition-all ${
            value === 'linktree'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-card hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <span>🔗</span>
                Linktree / Link em Bio
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Página com seus links principais — redes sociais, portfólio, WhatsApp e mais
              </div>
              <div className="mt-1.5 text-xs font-semibold text-primary">
                ✦ Preço fixo · Sem perguntas adicionais · Pronto em 3–5 dias
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xl font-bold text-primary tabular">R$ 150</div>
              <div className="mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Fixo
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
