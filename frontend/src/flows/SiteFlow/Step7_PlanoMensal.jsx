import React from 'react'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

const planConfig = {
  essencial: { icon: '🌱', features: ['Hospedagem + domínio + SSL', 'Backup mensal', 'Atualizações de segurança', 'Suporte por e-mail'] },
  plus: { icon: '⚡', features: ['Tudo do Essencial', '2h/mês de alterações', 'Backup semanal', 'Suporte WhatsApp', 'Relatório mensal'] },
  premium: { icon: '👑', features: ['Tudo do Plus', 'Alterações ilimitadas', '1 post de blog/mês', 'SEO contínuo', 'Suporte prioritário'] },
}

export default function Step7_PlanoMensal({ planos, value, onChange }) {
  return (
    <div>
      <h3 className="mb-1 text-lg font-bold text-foreground">Plano de manutenção mensal</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Inclui hospedagem, domínio, SSL e suporte contínuo após a entrega.
      </p>
      <div className="space-y-3">
        {planos.map((p) => {
          const cfg = planConfig[p.id] || { icon: '📦', features: [] }
          const isOn = value === p.id
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`w-full rounded-lg border p-4 text-left transition-all ${
                isOn ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-base font-bold text-foreground">
                    <span>{cfg.icon}</span>
                    <span>{p.nome}</span>
                  </div>
                  <ul className="mt-2 space-y-0.5">
                    {cfg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-primary">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xl font-bold text-primary tabular">{fmt(p.preco_final)}</div>
                  <div className="text-xs text-muted-foreground">/mês</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
