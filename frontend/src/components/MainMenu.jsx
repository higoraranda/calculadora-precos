import React from 'react'

const cards = [
  {
    id: 'automacao',
    icon: '🤖',
    title: 'Automação com IA',
    subtitle: 'Para clínicas e consultórios',
    description: 'Agendamento, follow-up, lembretes, triagem por IA e muito mais via N8N.',
    gradient: 'from-blue-600 to-indigo-700',
    border: 'border-blue-200',
    hover: 'hover:shadow-blue-200',
    badge: null,
  },
  {
    id: 'site',
    icon: '🌐',
    title: 'Criação de Site',
    subtitle: 'Para qualquer nicho',
    description: 'Landing pages, e-commerce, portfólio, sistemas web — você escolhe cada detalhe.',
    gradient: 'from-green-600 to-teal-700',
    border: 'border-green-200',
    hover: 'hover:shadow-green-200',
    badge: null,
  },
  {
    id: 'combo',
    icon: '🎯',
    title: 'Combo',
    subtitle: 'Automação + Site',
    description: 'Contrate os dois serviços juntos e economize 10% no setup total.',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-200',
    hover: 'hover:shadow-amber-200',
    badge: '10% OFF',
  },
]

export default function MainMenu({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Calculadora de Preços</h1>
        <p className="text-lg text-gray-500">Gere propostas profissionais em segundos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            className={`relative group bg-white rounded-2xl p-6 border-2 ${card.border} shadow-lg hover:shadow-xl ${card.hover} transition-all duration-200 text-left flex flex-col gap-4`}
          >
            {card.badge && (
              <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {card.badge}
              </span>
            )}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl shadow-md`}>
              {card.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-700">{card.title}</h2>
              <p className="text-sm text-gray-500 font-medium mt-0.5">{card.subtitle}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{card.description}</p>
            </div>
            <div className={`mt-auto pt-2 border-t border-gray-100 flex items-center text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
              Calcular agora →
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
