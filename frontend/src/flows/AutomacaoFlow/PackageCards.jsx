import React, { useState, useMemo } from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

// Calcula o setup personalizado mantendo o mesmo % de desconto do pacote base
function calcSetupPersonalizado(pacote, extrasServicos, multiplicador = 1.0) {
  if (!extrasServicos.length) return { setup: pacote.setup_final, economia: pacote.economia }
  const somaExtras = extrasServicos.reduce((s, sv) => s + sv.preco_final, 0)
  const novaAvulso = pacote._soma_avulso + somaExtras
  const discountRatio = pacote._soma_avulso > 0 ? pacote.setup_final / pacote._soma_avulso : 1
  const novoSetup = Math.round((novaAvulso * discountRatio) / 10) * 10
  const economia = Math.max(0, novaAvulso - novoSetup)
  return { setup: novoSetup, economia }
}

export default function PackageCards({ pacotes, servicos, selected, onSelect, extras, onToggleExtra }) {
  const [expandido, setExpandido] = useState(null) // id do pacote com painel aberto

  const handleSelect = (id) => {
    onSelect(id)
    setExpandido(id) // abre personalização ao selecionar
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pacotes.map((p) => {
          const isSelected = selected === p.id
          // Extras selecionados para este pacote
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
              className={`relative text-left p-5 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : p.destaque
                  ? 'border-indigo-300 bg-white'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              {p.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ MAIS POPULAR
                </span>
              )}
              <h3 className="font-bold text-lg text-gray-900 mb-1">{p.nome}</h3>
              <div className="text-2xl font-bold text-blue-700 mb-1">{fmt(setupFinal)}</div>
              <div className="text-sm text-gray-500 mb-3">{fmt(p.mensalidade_final)}/mês</div>
              {economia > 0 && (
                <div className="text-xs bg-green-100 text-green-700 rounded-lg px-2 py-1 mb-3 font-medium">
                  💎 Economize {fmt(economia)}
                </div>
              )}
              <ul className="space-y-1">
                {p.servicos.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
                {/* Mostra extras adicionados */}
                {extrasDoPlano.map((s) => (
                  <li key={s.id} className="flex items-start gap-2 text-xs text-blue-600 font-medium">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">+</span>
                    <span>{s.nome}</span>
                  </li>
                ))}
              </ul>
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Painel de personalização — aparece ao selecionar um pacote */}
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
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-900">✏️ Personalizar plano {pacoteSel.nome}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Adicione serviços extras mantendo o desconto de <strong>{descPct}%</strong> do pacote
                </p>
              </div>
              {extrasAtivos.length > 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-700">{fmt(setupAtual)}</div>
                  <div className="text-xs text-green-600 font-medium">💎 Economiza {fmt(economiaAtual)}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {servicosExtras.map((s) => {
                const isOn = extras.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={(e) => { e.stopPropagation(); onToggleExtra(s.id) }}
                    className={`text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${
                      isOn ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-sm text-gray-800 leading-tight">{s.nome}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-blue-700">{fmt(s.preco_final)}</span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isOn ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {isOn && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {extrasAtivos.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">
                Selecione serviços acima para personalizar o plano.
              </p>
            )}
          </div>
        )
      })()}
    </div>
  )
}
