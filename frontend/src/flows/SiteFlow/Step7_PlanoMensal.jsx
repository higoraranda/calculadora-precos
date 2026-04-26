import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

const planConfig = {
  essencial: { icon: '🌱', color: 'text-green-600', features: ['Hospedagem + domínio + SSL', 'Backup mensal', 'Atualizações de segurança', 'Suporte por e-mail'] },
  plus: { icon: '⚡', color: 'text-blue-600', features: ['Tudo do Essencial', '2h/mês de alterações', 'Backup semanal', 'Suporte WhatsApp', 'Relatório mensal'] },
  premium: { icon: '👑', color: 'text-amber-600', features: ['Tudo do Plus', 'Alterações ilimitadas', '1 post de blog/mês', 'SEO contínuo', 'Suporte prioritário'] },
}

export default function Step7_PlanoMensal({ planos, value, onChange }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">Plano de manutenção mensal</h3>
      <p className="text-sm text-gray-500 mb-4">
        Inclui hospedagem, domínio, SSL e suporte contínuo após a entrega.
      </p>
      <div className="space-y-3">
        {planos.map((p) => {
          const cfg = planConfig[p.id] || { icon: '📦', color: 'text-gray-600', features: [] }
          const isOn = value === p.id
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isOn ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className={`font-bold text-gray-900 flex items-center gap-2 text-base`}>
                    <span>{cfg.icon}</span>
                    <span>{p.nome}</span>
                  </div>
                  <ul className="mt-2 space-y-0.5">
                    {cfg.features.map((f, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="text-green-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-green-700 font-bold text-xl">{fmt(p.preco_final)}</div>
                  <div className="text-xs text-gray-400">/mês</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
