import React from 'react'

export default function ResumoSite({
  dados,
  tipos,
  designs,
  funcionalidades,
  conteudos,
  prazos,
  planos,
  onEdit,
}) {
  const tipo = tipos.find((t) => t.id === dados.tipo_id)
  const design = designs.find((d) => d.id === dados.design_id)
  const conteudo = conteudos.find((c) => c.id === dados.conteudo_id)
  const prazo = prazos.find((p) => p.id === dados.prazo_id)
  const plano = planos.find((p) => p.id === dados.plano_id)
  const extras = Math.max(0, dados.total_paginas - (tipo?.paginas_inclusas || 0))
  const funcsNomes = funcionalidades
    .filter((f) => dados.funcionalidades_ids.includes(f.id))
    .map((f) => f.nome)

  const rows = [
    {
      step: 0,
      icon: '🌐',
      label: 'Tipo de projeto',
      value: tipo?.nome || '—',
    },
    {
      step: 1,
      icon: '📄',
      label: 'Páginas',
      value: `${dados.total_paginas} total (${tipo?.paginas_inclusas || 0} inclusas${extras > 0 ? ` + ${extras} extra${extras > 1 ? 's' : ''}` : ''})`,
    },
    {
      step: 2,
      icon: '🎨',
      label: 'Design',
      value: design
        ? `${design.nome}${design.multiplicador > 1 ? ` (+${Math.round((design.multiplicador - 1) * 100)}%)` : ''}`
        : '—',
    },
    {
      step: 3,
      icon: '⚙️',
      label: 'Funcionalidades',
      value:
        funcsNomes.length > 0
          ? `${funcsNomes.length} selecionada${funcsNomes.length > 1 ? 's' : ''}: ${funcsNomes.slice(0, 2).join(', ')}${funcsNomes.length > 2 ? ` e mais ${funcsNomes.length - 2}` : ''}`
          : 'Nenhuma extra',
    },
    {
      step: 4,
      icon: '📝',
      label: 'Conteúdo',
      value: conteudo?.nome || '—',
    },
    {
      step: 5,
      icon: '⏱️',
      label: 'Prazo',
      value: prazo?.descricao || '—',
    },
    {
      step: 6,
      icon: '📦',
      label: 'Plano mensal',
      value: plano?.nome || '—',
    },
  ]

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">✅ Confirme as escolhas</h3>
      <p className="text-sm text-gray-500 mb-4">
        Revise cada item antes de calcular. Clique em <strong>Editar</strong> para ajustar.
      </p>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.step}
            className="flex items-start justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 gap-3"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="text-base mt-0.5">{r.icon}</span>
              <div className="min-w-0">
                <span className="text-xs text-gray-400 block">{r.label}</span>
                <span className="text-sm font-medium text-gray-800 block truncate">{r.value}</span>
              </div>
            </div>
            <button
              onClick={() => onEdit(r.step)}
              className="text-xs text-green-600 hover:text-green-800 font-semibold transition-colors shrink-0 underline"
            >
              Editar
            </button>
          </div>
        ))}
      </div>
      {dados.banco_imagens && (
        <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          <span>🖼️</span>
          <span>Banco de imagens premium incluído (+R$ 200)</span>
        </div>
      )}
    </div>
  )
}
