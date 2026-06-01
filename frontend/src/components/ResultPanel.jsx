import React, { useState } from 'react'
import { gerarProposta } from '../services/api'
import ProposalModal from './ProposalModal'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function ResultPanel({ tipo, resultado, onReset, clientInfo }) {
  const [proposta, setProposta] = useState(null)
  const [loading, setLoading] = useState(false)

  const buildDados = () => {
    const nomeCliente = clientInfo?.nome || ''
    if (tipo === 'automacao') return { ...resultado, nome_cliente: nomeCliente }
    if (tipo === 'site') return { ...resultado, nome_cliente: nomeCliente }
    if (tipo === 'linktree') return { ...resultado, nome_cliente: nomeCliente }
    if (tipo === 'combo') {
      const aut = resultado.automacao
      const site = resultado.site
      return {
        cidade: resultado.cidade,
        setup_automacao: resultado.setup_automacao,
        setup_site: resultado.setup_site,
        desconto: resultado.desconto,
        total_setup: resultado.total_setup,
        mensalidade_automacao: resultado.mensalidade_automacao,
        mensalidade_site: resultado.mensalidade_site,
        nome_pacote: aut.nome_pacote,
        servicos: aut.servicos,
        tipo_site: site.tipo_nome,
        nivel_design: site.design_nome,
        funcionalidades: site.funcionalidades,
        prazo_site: site.prazo_texto,
        nome_plano: site.nome_plano,
        nome_cliente: nomeCliente,
      }
    }
    return { ...resultado, nome_cliente: nomeCliente }
  }

  const handleGerar = async () => {
    setLoading(true)
    try {
      const data = await gerarProposta(tipo, buildDados())
      setProposta(data.texto)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl animate-slide-up">
        <div className="mb-6 rounded-xl gradient-primary p-6 text-primary-foreground shadow-glow">
          <h2 className="mb-4 text-2xl font-bold">💰 Resumo do Investimento</h2>

          {tipo === 'automacao' && (
            <>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-primary-foreground/80">Setup único</span>
                <span className="text-2xl font-bold tabular">{fmt(resultado.setup)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-foreground/80">Mensalidade</span>
                <span className="text-xl font-semibold tabular">{fmt(resultado.mensalidade)}/mês</span>
              </div>
              {resultado.economia > 0 && (
                <div className="mt-3 rounded-lg bg-white/20 px-4 py-2 text-sm">
                  💎 Você economiza <strong>{fmt(resultado.economia)}</strong> no pacote!
                </div>
              )}
            </>
          )}

          {tipo === 'site' && (
            <>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-primary-foreground/80">Desenvolvimento (único)</span>
                <span className="text-2xl font-bold tabular">{fmt(resultado.setup)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-foreground/80">Manutenção mensal ({resultado.nome_plano})</span>
                <span className="text-xl font-semibold tabular">{fmt(resultado.mensalidade)}/mês</span>
              </div>
            </>
          )}

          {tipo === 'linktree' && (
            <>
              <div className="mb-3 flex items-center gap-3">
                <span className="text-4xl">🔗</span>
                <div>
                  <div className="text-sm text-primary-foreground/75">Linktree / Link em Bio</div>
                  <div className="text-4xl font-bold tabular">{fmt(resultado.setup)}</div>
                </div>
              </div>
              <div className="rounded-lg bg-white/20 px-4 py-2 text-sm">
                ✦ Preço fixo · Pagamento único · Sem mensalidade
              </div>
            </>
          )}

          {tipo === 'combo' && (
            <>
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm text-primary-foreground/80"><span>Setup automação</span><span className="tabular">{fmt(resultado.setup_automacao)}</span></div>
                <div className="flex justify-between text-sm text-primary-foreground/80"><span>Setup site</span><span className="tabular">{fmt(resultado.setup_site)}</span></div>
                <div className="flex justify-between text-sm text-primary-foreground/80"><span>Subtotal</span><span className="tabular">{fmt(resultado.subtotal_setup)}</span></div>
                <div className="flex justify-between text-sm font-semibold"><span>🎁 Desconto combo (10%)</span><span className="tabular">-{fmt(resultado.desconto)}</span></div>
                <div className="flex justify-between border-t border-white/30 pt-2 text-xl font-bold"><span>Total setup</span><span className="tabular">{fmt(resultado.total_setup)}</span></div>
              </div>
              <div className="space-y-1 border-t border-white/30 pt-3">
                <div className="flex justify-between text-sm text-primary-foreground/80"><span>Mensalidade automação</span><span className="tabular">{fmt(resultado.mensalidade_automacao)}/mês</span></div>
                <div className="flex justify-between text-sm text-primary-foreground/80"><span>Mensalidade site</span><span className="tabular">{fmt(resultado.mensalidade_site)}/mês</span></div>
                <div className="flex justify-between text-lg font-bold"><span>Total mensal</span><span className="tabular">{fmt(resultado.total_mensalidade)}/mês</span></div>
              </div>
            </>
          )}
        </div>

        {tipo === 'site' && resultado.detalhamento && (
          <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-bold text-foreground">📊 Detalhamento do cálculo</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Tipo de projeto ({resultado.tipo_nome})</span><span className="tabular">{fmt(resultado.detalhamento.tipo_preco)}</span></div>
              {resultado.paginas_extras > 0 && (
                <div className="flex justify-between"><span>Páginas extras ({resultado.paginas_extras} × {fmt(resultado.preco_pagina_extra)})</span><span className="tabular">{fmt(resultado.detalhamento.paginas_extras_preco)}</span></div>
              )}
              {resultado.detalhamento.funcionalidades_preco > 0 && (
                <div className="flex justify-between"><span>Funcionalidades extras</span><span className="tabular">{fmt(resultado.detalhamento.funcionalidades_preco)}</span></div>
              )}
              {resultado.detalhamento.conteudo_preco > 0 && (
                <div className="flex justify-between"><span>Conteúdo</span><span className="tabular">{fmt(resultado.detalhamento.conteudo_preco)}</span></div>
              )}
              {resultado.detalhamento.banco_imagens_preco > 0 && (
                <div className="flex justify-between"><span>Banco de imagens</span><span className="tabular">{fmt(resultado.detalhamento.banco_imagens_preco)}</span></div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground"><span>Subtotal</span><span className="tabular">{fmt(resultado.detalhamento.subtotal_antes_multiplicadores)}</span></div>
              {resultado.multiplicador_design > 1 && (
                <div className="flex justify-between text-primary"><span>× Design {resultado.design_nome} (+{Math.round((resultado.multiplicador_design-1)*100)}%)</span><span></span></div>
              )}
              {resultado.multiplicador_prazo > 1 && (
                <div className="flex justify-between text-warning"><span>× Prazo urgente (+{Math.round((resultado.multiplicador_prazo-1)*100)}%)</span><span></span></div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground"><span>Setup final</span><span className="tabular">{fmt(resultado.setup)}</span></div>
            </div>
          </div>
        )}

        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>
                <strong className="text-foreground">Prazo:</strong>{' '}
                {tipo === 'combo' ? '45 dias' :
                 tipo === 'automacao' ? '30 dias' :
                 resultado.prazo_texto}
              </span>
            </div>
            <div className="flex items-center gap-2"><span>💳</span><span><strong className="text-foreground">Pagamento:</strong> {tipo === 'linktree' ? '100% antecipado' : '50% + 50% entrega'}</span></div>
            <div className="flex items-center gap-2"><span>📍</span><span><strong className="text-foreground">Cidade:</strong> {resultado.cidade}</span></div>
            {tipo === 'automacao' && <div className="flex items-center gap-2"><span>📦</span><span><strong className="text-foreground">Pacote:</strong> {resultado.nome_pacote}</span></div>}
            {tipo === 'linktree' && <div className="flex items-center gap-2"><span>🔗</span><span><strong className="text-foreground">Produto:</strong> Linktree</span></div>}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleGerar}
            disabled={loading}
            className="flex-1 rounded-lg gradient-primary py-4 text-base font-bold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? '⏳ Gerando...' : '📋 Gerar Proposta'}
          </button>
          <button
            onClick={onReset}
            className="rounded-lg border border-border bg-card px-6 py-4 font-semibold text-foreground transition-all hover:bg-muted"
          >
            Nova Calculadora
          </button>
        </div>
      </div>

      {proposta && <ProposalModal texto={proposta} clientInfo={clientInfo} onClose={() => setProposta(null)} />}
    </div>
  )
}
