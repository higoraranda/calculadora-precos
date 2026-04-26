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

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
      <h3 className="font-semibold text-gray-800 mb-3">Nova cidade</h3>

      <input
        type="text"
        placeholder="Nome da cidade"
        value={nome}
        onChange={e => setNome(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <div className="space-y-1 mb-3">
        {PRESETS.map((p, i) => (
          <label key={i} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-all ${presetIdx === i ? 'bg-blue-50 border border-blue-300' : 'hover:bg-gray-100'}`}>
            <input type="radio" name="preset" checked={presetIdx === i} onChange={() => setPresetIdx(i)} className="sr-only" />
            <span>{p.icon}</span>
            <span className="flex-1">{p.label}</span>
            {p.multiplicador !== null && <span className="text-gray-400 text-xs">×{p.multiplicador}</span>}
          </label>
        ))}
      </div>

      {PRESETS[presetIdx].multiplicador === null && (
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">Multiplicador personalizado (0.8 – 2.5)</label>
          <input
            type="number"
            min={0.8} max={2.5} step={0.1}
            value={customMult}
            onChange={e => setCustomMult(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      )}

      <div className="text-xs text-gray-500 bg-white rounded-lg p-2 border border-gray-200 mb-3">
        💡 Multiplicador aplicado: <strong>×{mult.toFixed(1)}</strong>
        <span className="text-gray-400"> — preços {mult > 1 ? `${Math.round((mult-1)*100)}% maiores` : 'base (sem ajuste)'}</span>
      </div>

      <div className="flex gap-2">
        <button onClick={() => nome.trim() && onSave({ nome: nome.trim(), multiplicador: mult })} disabled={!nome.trim()} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-40">Salvar</button>
        <button onClick={onCancel} className="px-4 py-2 text-gray-500 text-sm">Cancelar</button>
      </div>
    </div>
  )
}
