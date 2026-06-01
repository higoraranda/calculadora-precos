import { useEffect, useState } from 'react'

// Tema claro/escuro com persistência em localStorage (padrão: escuro).
// O <html> recebe/retira a classe `dark`, que ativa as variáveis do index.css.
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
