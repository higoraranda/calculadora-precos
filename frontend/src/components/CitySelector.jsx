import React, { useState, useEffect } from 'react'
import { getCidades } from '../services/api'
import CustomCityForm from './CustomCityForm'

const LAST_CITY_KEY = 'calculadora_ultima_cidade'

export default function CitySelector({ onSelect, mode }) {
  const [cidades, setCidades] = useState([])
  const [customCities, setCustomCities] = useState(() => {
    try { return JSON.parse(localStorage.getItem('calculadora_cidades_customizadas') || '[]') } catch { return [] }
  })
  const [selected, setSelected] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [loading, setLoading] = useState(true)

  const colorMap = {
    automacao: 'blue',
    site: 'green',
    combo: 'amber',
  }
  const color = colorMap[mode] || 'blue'
  const btnClass = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    amber: 'bg-amber-500 hover:bg-amber-600',
  }[color]

  useEffect(() => {
    getCidades().then(data => {
      setCidades(data.cidades)
      const last = localStorage.getItem(LAST_CITY_KEY)
      if (last) {
        const parsed = JSON.parse(last)
        setSelected(parsed.nome)
      }
    }).finally(() => setLoading(false))
  }, [])

  const allCities = [...cidades, ...customCities]

  const handleSubmit = () => {
    const city = allCities.find(c => c.nome === selected)
    if (city) {
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city))
      onSelect(city)
    }
  }

  const handleCustomCity = (city) => {
    const updated = [...customCities.filter(c => c.nome !== city.nome), city]
    setCustomCities(updated)
    localStorage.setItem('calculadora_cidades_customizadas', JSON.stringify(updated))
    setSelected(city.nome)
    setShowCustom(false)
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecione a cidade</h2>
        <p className="text-gray-500 text-sm mb-6">O preço varia de acordo com a região do cliente.</p>

        <div className="space-y-2 mb-4">
          {allCities.map(c => (
            <label
              key={c.nome}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selected === c.nome ? `border-${color}-500 bg-${color}-50` : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="cidade"
                value={c.nome}
                checked={selected === c.nome}
                onChange={() => setSelected(c.nome)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selected === c.nome ? `border-${color}-500 bg-${color}-500` : 'border-gray-300'
              }`}>
                {selected === c.nome && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="font-medium text-gray-800">{c.nome}</span>
              {c.multiplicador > 1.0 && (
                <span className="ml-auto text-xs text-gray-400">+{Math.round((c.multiplicador - 1) * 100)}% regional</span>
              )}
            </label>
          ))}

          <button
            onClick={() => setShowCustom(!showCustom)}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-all w-full text-left"
          >
            <span className="text-gray-400 text-lg">+</span>
            <span className="text-gray-500 font-medium">Outra cidade</span>
          </button>
        </div>

        {showCustom && (
          <CustomCityForm onSave={handleCustomCity} onCancel={() => setShowCustom(false)} />
        )}

        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={`w-full mt-4 py-3 rounded-xl text-white font-semibold text-base transition-all ${
            selected ? `${btnClass} shadow-md hover:shadow-lg` : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
