import React from 'react'

const cards = [
  {
    id: 'automacao',
    icon: '🤖',
    title: 'Automação com IA',
    subtitle: 'Para clínicas e consultórios',
    description: 'Agendamento, follow-up, lembretes, triagem por IA e muito mais via N8N.',
    badge: null,
  },
  {
    id: 'site',
    icon: '🌐',
    title: 'Criação de Site',
    subtitle: 'Para qualquer nicho',
    description: 'Landing pages, e-commerce, portfólio, sistemas web — você escolhe cada detalhe.',
    badge: null,
  },
  {
    id: 'combo',
    icon: '🎯',
    title: 'Combo',
    subtitle: 'Automação + Site',
    description: 'Contrate os dois serviços juntos e economize 10% no setup total.',
    badge: '10% OFF',
  },
]

export default function MainMenu({ onSelect }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          <span className="gradient-text">Calculadora de Preços</span>
        </h1>
        <p className="text-lg text-muted-foreground">Gere propostas profissionais em segundos</p>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 text-left shadow-card transition-all duration-200 animate-slide-up hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
          >
            {card.badge && (
              <span className="absolute right-4 top-4 rounded-full gradient-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow-glow">
                {card.badge}
              </span>
            )}
            <div className="grid h-14 w-14 place-items-center rounded-xl gradient-primary text-2xl shadow-glow">
              {card.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">{card.title}</h2>
              <p className="mt-0.5 text-sm font-medium text-muted-foreground">{card.subtitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            </div>
            <div className="mt-auto flex items-center border-t border-border pt-3 text-sm font-semibold text-primary">
              Calcular agora →
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
