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
      <h3 className="text-lg font-bold text-gray-800 mb-1">Funcionalidades extras</h3>
      <p className="text-sm text-gray-500 mb-3">
        Selecione os recursos que o projeto precisará. Deixe em branco se não houver extras.
      </p>

      <input
        type="text"
        placeholder="🔍 Pesquisar funcionalidade..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:ring-2 focus:ring-green-400 outline-none transition-all"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 mb-4">
        {filtered.map((f) => {
          const isOn = selected.includes(f.id)
          return (
            <button
              key={f.id}
              onClick={() => onToggle(f.id)}
              className={`text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${
                isOn
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <span className="text-sm text-gray-800 leading-tight">{f.nome}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-green-700">{fmt(f.preco_base)}</span>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isOn ? 'bg-green-600 border-green-600' : 'border-gray-300'
                  }`}
                >
                  {isOn && <span className="text-white text-xs font-bold">✓</span>}
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 col-span-2 py-4 text-center">
            Nenhuma funcionalidade encontrada.
          </p>
        )}
      </div>

      {selected.length > 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-medium">
          {selected.length} funcionalidade{selected.length > 1 ? 's' : ''} selecionada
          {selected.length > 1 ? 's' : ''} • Total:{' '}
          <strong>{fmt(total)}</strong>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-500">
          Nenhuma funcionalidade extra selecionada (pode pular esta etapa).
        </div>
      )}
    </div>
  )
}
