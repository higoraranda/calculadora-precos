import React, { useState } from 'react'

const PRESETS = [
  { label: 'Cidade pequena/interior', icon: '🏘️', multiplicador: 1.0 },
  { label: 'Cidade média', icon: '🏙️', multiplicador: 1.2 },
  { label: 'Cidade grande/polo regional', icon: '🌆', multiplicador: 1.4 },
  { label: 'Capital/grande centro', icon: '💼', multiplicador: 1.6 },
  { label: 'Personalizado', icon: '⚙️', multiplicador: null },
]

export default function CustomCityForm({ onSave, onCancel }) {
  const [nome, setNome] = useState('')
  const [presetIdx, setPresetIdx] = useState(0)
  const [customMult, setCustomMult] = useState(1.0)

  const getMultiplicador = () => {
    const preset = PRESETS[presetIdx]
    return preset.multiplicador !== null ? preset.multiplicador : Math.max(0.8, Math.min(2.5, customMult))
  }

  const mult = getMultiplicador()
  const inputCls =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30'

  return (
    <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4">
      <h3 className="mb-3 font-semibold text-foreground">Nova cidade</h3>

      <input
        type="text"
        placeholder="Nome da cidade"
        value={nome}
        onChange={e => setNome(e.target.value)}
        className={`mb-3 ${inputCls}`}
      />

      <div className="mb-3 space-y-1">
        {PRESETS.map((p, i) => (
          <label key={i} className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm transition-all ${presetIdx === i ? 'border border-primary/30 bg-primary/10' : 'hover:bg-muted'}`}>
            <input type="radio" name="preset" checked={presetIdx === i} onChange={() => setPresetIdx(i)} className="sr-only" />
            <span>{p.icon}</span>
            <span className="flex-1 text-foreground">{p.label}</span>
            {p.multiplicador !== null && <span className="text-xs text-muted-foreground">×{p.multiplicador}</span>}
          </label>
        ))}
      </div>

      {PRESETS[presetIdx].multiplicador === null && (
        <div className="mb-3">
          <label className="mb-1 block text-xs text-muted-foreground">Multiplicador personalizado (0.8 – 2.5)</label>
          <input
            type="number"
            min={0.8} max={2.5} step={0.1}
            value={customMult}
            onChange={e => setCustomMult(parseFloat(e.target.value))}
            className={inputCls}
          />
        </div>
      )}

      <div className="mb-3 rounded-lg border border-border bg-card p-2 text-xs text-muted-foreground">
        💡 Multiplicador aplicado: <strong className="text-foreground">×{mult.toFixed(1)}</strong>
        <span> — preços {mult > 1 ? `${Math.round((mult-1)*100)}% maiores` : 'base (sem ajuste)'}</span>
      </div>

      <div className="flex gap-2">
        <button onClick={() => nome.trim() && onSave({ nome: nome.trim(), multiplicador: mult })} disabled={!nome.trim()} className="flex-1 rounded-lg gradient-primary py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 disabled:opacity-40">Salvar</button>
        <button onClick={onCancel} className="px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">Cancelar</button>
      </div>
    </div>
  )
}
