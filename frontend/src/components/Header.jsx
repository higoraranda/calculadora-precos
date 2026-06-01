import React from 'react'
import { useTheme } from '../hooks/useTheme'

const modeConfig = {
  automacao: { label: 'Automação com IA', icon: '🤖' },
  site: { label: 'Criação de Site', icon: '🌐' },
  combo: { label: 'Combo Automação + Site', icon: '🎯' },
}

function CalcIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
    </svg>
  )
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {theme === 'dark' ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6.4 6.4 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}

export default function Header({ mode, cidade, onBack, onHome }) {
  const cfg = mode ? modeConfig[mode] : null

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
        <button onClick={onHome} className="flex items-center gap-2.5" title="Início">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
            <CalcIcon />
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-bold tracking-tight">Calculadora</span>
            <span className="block text-[11px] text-muted-foreground">Serviços digitais</span>
          </span>
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="ml-1 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            ← Voltar
          </button>
        )}

        <div className="flex-1" />

        {cfg && (
          <span className="hidden items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary md:inline-flex">
            {cfg.icon} {cfg.label}
          </span>
        )}
        {cidade && (
          <span className="hidden items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground sm:inline-flex">
            📍 {cidade}
          </span>
        )}

        <a
          href="https://project-k3a8s.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center rounded-lg gradient-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Fazer orçamento
        </a>

        <ThemeToggle />
      </div>
    </header>
  )
}
