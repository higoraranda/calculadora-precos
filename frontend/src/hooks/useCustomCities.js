import { useState, useEffect } from 'react'

const STORAGE_KEY = 'calculadora_cidades_customizadas'

export function useCustomCities() {
  const [customCities, setCustomCities] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const addCity = (city) => {
    setCustomCities(prev => {
      const exists = prev.find(c => c.nome.toLowerCase() === city.nome.toLowerCase())
      if (exists) return prev
      const updated = [...prev, city]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const removeCity = (nome) => {
    setCustomCities(prev => {
      const updated = prev.filter(c => c.nome !== nome)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return { customCities, addCity, removeCity }
}
