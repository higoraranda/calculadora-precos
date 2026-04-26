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
      <h3 className="text-lg font-bold text-gray-800 mb-4">Quem vai produzir o conteúdo?</h3>
      <div className="space-y-3 mb-5">
        {opcoes.map((o) => {
          const preco = o.por_pagina ? o.preco_base * totalPaginas : o.preco_base
          const isOn = value === o.id
          return (
            <button
              key={o.id}
              onClick={() => onChangeConteudo(o.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isOn
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icons[o.id]}</span>
                  <span className="text-sm font-medium text-gray-800">{o.nome}</span>
                </div>
                <span className="text-green-700 font-bold text-sm shrink-0">
                  {preco === 0 ? 'Grátis' : fmt(preco)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Complemento de conteúdo:</p>
        <button
          onClick={() => onChangeBanco(!bancoImagens)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
            bancoImagens
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-green-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🖼️</span>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-800">Banco de imagens premium</div>
              <div className="text-xs text-gray-500">Imagens profissionais licenciadas para o projeto</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-green-700 font-bold text-sm">R$ 200</span>
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                bancoImagens ? 'bg-green-600 border-green-600' : 'border-gray-300'
              }`}
            >
              {bancoImagens && <span className="text-white text-xs font-bold">✓</span>}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
