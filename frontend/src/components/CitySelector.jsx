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

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  )

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-card animate-scale-in">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Selecione a cidade</h2>
        <p className="mb-6 text-sm text-muted-foreground">O preço varia de acordo com a região do cliente.</p>

        <div className="mb-4 space-y-2">
          {allCities.map(c => {
            const active = selected === c.nome
            return (
              <label
                key={c.nome}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                  active ? 'border-primary bg-primary/10' : 'border-border hover:border-ring/40 hover:bg-muted'
                }`}
              >
                <input type="radio" name="cidade" value={c.nome} checked={active} onChange={() => setSelected(c.nome)} className="sr-only" />
                <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${active ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                  {active && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                </div>
                <span className="font-medium text-foreground">{c.nome}</span>
                {c.multiplicador > 1.0 && (
                  <span className="ml-auto text-xs text-muted-foreground">+{Math.round((c.multiplicador - 1) * 100)}% regional</span>
                )}
              </label>
            )
          })}

          <button
            onClick={() => setShowCustom(!showCustom)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-3 text-left transition-all hover:border-ring/40 hover:bg-muted"
          >
            <span className="text-lg text-muted-foreground">+</span>
            <span className="font-medium text-muted-foreground">Outra cidade</span>
          </button>
        </div>

        {showCustom && (
          <CustomCityForm onSave={handleCustomCity} onCancel={() => setShowCustom(false)} />
        )}

        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={`mt-4 w-full rounded-lg py-3 text-base font-semibold transition-all ${
            selected
              ? 'gradient-primary text-primary-foreground shadow-glow hover:brightness-110 active:scale-[0.99]'
              : 'cursor-not-allowed bg-muted text-muted-foreground'
          }`}
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
