import React, { useState } from 'react'
import { gerarProposta } from '../services/api'
import ProposalModal from './ProposalModal'

const fmt = (n) => `R$ ${Number(n).toLocaleString('pt-BR')}`

export default function ResultPanel({ tipo, resultado, onReset }) {
  const [proposta, setProposta] = useState(null)
  const [loading, setLoading] = useState(false)

  const colorMap = { automacao: 'blue', site: 'green', combo: 'amber', linktree: 'purple' }
  const color = colorMap[tipo] || 'blue'

  const gradients = {
    blue: 'from-blue-600 to-indigo-700',
    green: 'from-green-600 to-teal-700',
    amber: 'from-amber-500 to-orange-600',
    purple: 'from-purple-600 to-violet-700',
  }

  const buildDados = () => {
    if (tipo === 'automacao') return resultado
    if (tipo === 'site') return resultado
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
      }
    }
    return resultado
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <div className={`bg-gradient-to-br ${gradients[color]} rounded-2xl p-6 text-white mb-6 shadow-xl`}>
          <h2 className="text-2xl font-bold mb-4">💰 Resumo do Investimento</h2>

          {tipo === 'automacao' && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="opacity-80">Setup único</span>
                <span className="text-2xl font-bold">{fmt(resultado.setup)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Mensalidade</span>
                <span className="text-xl font-semibold">{fmt(resultado.mensalidade)}/mês</span>
              </div>
              {resultado.economia > 0 && (
                <div className="mt-3 bg-white/20 rounded-xl px-4 py-2 text-sm">
                  💎 Você economiza <strong>{fmt(resultado.economia)}</strong> no pacote!
                </div>
              )}
            </>
          )}

          {tipo === 'site' && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="opacity-80">Desenvolvimento (único)</span>
                <span className="text-2xl font-bold">{fmt(resultado.setup)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Manutenção mensal ({resultado.nome_plano})</span>
                <span className="text-xl font-semibold">{fmt(resultado.mensalidade)}/mês</span>
              </div>
            </>
          )}

          {tipo === 'linktree' && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🔗</span>
                <div>
                  <div className="text-sm opacity-75">Linktree / Link em Bio</div>
                  <div className="text-4xl font-bold">{fmt(resultado.setup)}</div>
                </div>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-2 text-sm">
                ✦ Preço fixo · Pagamento único · Sem mensalidade
              </div>
            </>
          )}

          {tipo === 'combo' && (
            <>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm opacity-80"><span>Setup automação</span><span>{fmt(resultado.setup_automacao)}</span></div>
                <div className="flex justify-between text-sm opacity-80"><span>Setup site</span><span>{fmt(resultado.setup_site)}</span></div>
                <div className="flex justify-between text-sm opacity-80"><span>Subtotal</span><span>{fmt(resultado.subtotal_setup)}</span></div>
                <div className="flex justify-between text-sm text-green-300"><span>🎁 Desconto combo (10%)</span><span>-{fmt(resultado.desconto)}</span></div>
                <div className="flex justify-between text-xl font-bold border-t border-white/30 pt-2"><span>Total setup</span><span>{fmt(resultado.total_setup)}</span></div>
              </div>
              <div className="space-y-1 border-t border-white/30 pt-3">
                <div className="flex justify-between text-sm opacity-80"><span>Mensalidade automação</span><span>{fmt(resultado.mensalidade_automacao)}/mês</span></div>
                <div className="flex justify-between text-sm opacity-80"><span>Mensalidade site</span><span>{fmt(resultado.mensalidade_site)}/mês</span></div>
                <div className="flex justify-between text-lg font-bold"><span>Total mensal</span><span>{fmt(resultado.total_mensalidade)}/mês</span></div>
              </div>
            </>
          )}
        </div>

        {tipo === 'site' && resultado.detalhamento && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">📊 Detalhamento do cálculo</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Tipo de projeto ({resultado.tipo_nome})</span><span>{fmt(resultado.detalhamento.tipo_preco)}</span></div>
              {resultado.paginas_extras > 0 && (
                <div className="flex justify-between"><span>Páginas extras ({resultado.paginas_extras} × {fmt(resultado.preco_pagina_extra)})</span><span>{fmt(resultado.detalhamento.paginas_extras_preco)}</span></div>
              )}
              {resultado.detalhamento.funcionalidades_preco > 0 && (
                <div className="flex justify-between"><span>Funcionalidades extras</span><span>{fmt(resultado.detalhamento.funcionalidades_preco)}</span></div>
              )}
              {resultado.detalhamento.conteudo_preco > 0 && (
                <div className="flex justify-between"><span>Conteúdo</span><span>{fmt(resultado.detalhamento.conteudo_preco)}</span></div>
              )}
              {resultado.detalhamento.banco_imagens_preco > 0 && (
                <div className="flex justify-between"><span>Banco de imagens</span><span>{fmt(resultado.detalhamento.banco_imagens_preco)}</span></div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2"><span>Subtotal</span><span>{fmt(resultado.detalhamento.subtotal_antes_multiplicadores)}</span></div>
              {resultado.multiplicador_design > 1 && (
                <div className="flex justify-between text-indigo-600"><span>× Design {resultado.design_nome} (+{Math.round((resultado.multiplicador_design-1)*100)}%)</span><span></span></div>
              )}
              {resultado.multiplicador_prazo > 1 && (
                <div className="flex justify-between text-orange-500"><span>× Prazo urgente (+{Math.round((resultado.multiplicador_prazo-1)*100)}%)</span><span></span></div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Setup final</span><span>{fmt(resultado.setup)}</span></div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>
                <strong>Prazo:</strong>{' '}
                {tipo === 'combo' ? '45 dias' :
                 tipo === 'automacao' ? '30 dias' :
                 resultado.prazo_texto}
              </span>
            </div>
            <div className="flex items-center gap-2"><span>💳</span><span><strong>Pagamento:</strong> {tipo === 'linktree' ? '100% antecipado' : '50% + 50% entrega'}</span></div>
            <div className="flex items-center gap-2"><span>📍</span><span><strong>Cidade:</strong> {resultado.cidade}</span></div>
            {tipo === 'automacao' && <div className="flex items-center gap-2"><span>📦</span><span><strong>Pacote:</strong> {resultado.nome_pacote}</span></div>}
            {tipo === 'linktree' && <div className="flex items-center gap-2"><span>🔗</span><span><strong>Produto:</strong> Linktree</span></div>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGerar}
            disabled={loading}
            className={`flex-1 py-4 rounded-xl font-bold text-white text-base transition-all shadow-lg hover:shadow-xl ${
              color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
              color === 'green' ? 'bg-green-600 hover:bg-green-700' :
              color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-amber-500 hover:bg-amber-600'
            } disabled:opacity-50`}
          >
            {loading ? '⏳ Gerando...' : '📋 Gerar Proposta'}
          </button>
          <button
            onClick={onReset}
            className="px-6 py-4 rounded-xl font-semibold text-gray-600 bg-white border-2 border-gray-200 hover:border-gray-300 transition-all"
          >
            Nova Calculadora
          </button>
        </div>
      </div>

      {proposta && <ProposalModal texto={proposta} onClose={() => setProposta(null)} />}
    </div>
  )
}
