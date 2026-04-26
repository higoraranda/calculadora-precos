import { useState, useCallback } from 'react'

const DRAFT_KEY = 'calculadora_rascunho'

export function useCalculator() {
  const [draft, setDraft] = useState(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const saveDraft = useCallback((data) => {
    setDraft(data)
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  }, [])

  const clearDraft = useCallback(() => {
    setDraft(null)
    localStorage.removeItem(DRAFT_KEY)
  }, [])

  return { draft, saveDraft, clearDraft }
}
