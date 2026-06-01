import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

const icons = {
  cliente_fornece: '📁',
  adapto_conteudo: '✏️',
  produzo_conteudo: '📝',
}

export default function Step5_Conteudo({
  opcoes,
  value,
  totalPaginas,
  bancoImagens,
  onChangeConteudo,
  onChangeBanco,
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-foreground">Quem vai produzir o conteúdo?</h3>
      <div className="mb-5 space-y-3">
        {opcoes.map((o) => {
          const preco = o.por_pagina ? o.preco_base * totalPaginas : o.preco_base
          const isOn = value === o.id
          return (
            <button
              key={o.id}
              onClick={() => onChangeConteudo(o.id)}
              className={`w-full rounded-lg border p-4 text-left transition-all ${
                isOn
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icons[o.id]}</span>
                  <span className="text-sm font-medium text-foreground">{o.nome}</span>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary tabular">
                  {preco === 0 ? 'Grátis' : fmt(preco)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="border-t border-border pt-4">
        <p className="mb-3 text-sm font-semibold text-foreground">Complemento de conteúdo:</p>
        <button
          onClick={() => onChangeBanco(!bancoImagens)}
          className={`flex w-full items-center justify-between rounded-lg border p-4 transition-all ${
            bancoImagens
              ? 'border-primary bg-primary/10'
              : 'border-border bg-card hover:border-primary/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🖼️</span>
            <div className="text-left">
              <div className="text-sm font-medium text-foreground">Banco de imagens premium</div>
              <div className="text-xs text-muted-foreground">Imagens profissionais licenciadas para o projeto</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-bold text-primary tabular">R$ 200</span>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                bancoImagens ? 'border-primary bg-primary' : 'border-muted-foreground/40'
              }`}
            >
              {bancoImagens && <span className="text-xs font-bold text-primary-foreground">✓</span>}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
