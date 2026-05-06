from typing import Any, Dict


def _saudacao(nome_cliente: str) -> str:
    if nome_cliente:
        return f"Olá *{nome_cliente}* e equipe, segue abaixo proposta comercial:\n\n"
    return ""


def gerar_proposta_automacao(dados: Dict[str, Any]) -> str:
    nome_cliente = dados.get("nome_cliente", "")
    cidade = dados.get("cidade", "")
    nome_pacote = dados.get("nome_pacote", "Personalizado")
    servicos = dados.get("servicos", [])
    setup = dados.get("setup", 0)
    mensalidade = dados.get("mensalidade", 0)
    economia = dados.get("economia", 0)
    num_func = dados.get("num_funcionarios", 1)

    lista_servicos = "\n".join(f"- {s}" for s in servicos)
    economia_txt = f"\n💎 Você economiza R$ {economia:,.0f} no pacote!".replace(",", ".") if economia > 0 else ""
    equipe_txt = f"\n👥 Equipe configurada para {num_func} funcionário{'s' if num_func > 1 else ''}" if num_func > 1 else ""

    return f"""{_saudacao(nome_cliente)}🤖 *PROPOSTA - AUTOMAÇÃO COM IA PARA CLÍNICAS*

📍 Cidade: {cidade}
📦 Pacote: {nome_pacote}

✅ *Serviços inclusos:*
{lista_servicos}

💰 *Investimento:*
- Setup (único): R$ {setup:,.0f}
- Mensalidade: R$ {mensalidade:,.0f}/mês

⏱️ *Prazo de entrega:* 30 dias
💳 *Forma de pagamento:* 50% na assinatura + 50% na entrega
{economia_txt}{equipe_txt}

Dúvidas? Estou à disposição!""".replace(",", ".")


def gerar_proposta_site(dados: Dict[str, Any]) -> str:
    nome_cliente = dados.get("nome_cliente", "")
    cidade = dados.get("cidade", "")
    tipo = dados.get("tipo_nome", dados.get("tipo", ""))
    total_paginas = dados.get("total_paginas", 0)
    paginas_inclusas = dados.get("paginas_inclusas", 0)
    paginas_extras = max(0, total_paginas - paginas_inclusas)
    nivel_design = dados.get("design_nome", dados.get("nivel_design", ""))
    funcionalidades = dados.get("funcionalidades", [])
    opcao_conteudo = dados.get("opcao_conteudo", "")
    prazo = dados.get("prazo_texto", dados.get("prazo", "30 dias"))
    nome_plano = dados.get("nome_plano", "")
    descricao_plano = dados.get("descricao_plano", "")
    setup = dados.get("setup", 0)
    mensalidade = dados.get("mensalidade", 0)

    lista_func = "\n".join(f"- {f}" for f in funcionalidades) if funcionalidades else "- Nenhuma funcionalidade extra"
    extras_txt = f"{paginas_inclusas} inclusas + {paginas_extras} adicionais" if paginas_extras > 0 else f"{paginas_inclusas} inclusas"

    return f"""{_saudacao(nome_cliente)}🌐 *PROPOSTA - CRIAÇÃO DE SITE PROFISSIONAL*

📍 Cidade: {cidade}

✅ *Especificações do projeto:*
- Tipo: {tipo}
- Páginas: {total_paginas} ({extras_txt})
- Design: {nivel_design}
- Funcionalidades:
{lista_func}
- Conteúdo: {opcao_conteudo}

💰 *Investimento:*
- Desenvolvimento (único): R$ {setup:,.0f}
- Manutenção mensal ({nome_plano}): R$ {mensalidade:,.0f}/mês
  ({descricao_plano})

⏱️ *Prazo de entrega:* {prazo}
💳 *Forma de pagamento:* 50% na assinatura + 50% na entrega

Dúvidas? Estou à disposição!""".replace(",", ".")


def gerar_proposta_linktree(dados: Dict[str, Any]) -> str:
    nome_cliente = dados.get("nome_cliente", "")
    cidade = dados.get("cidade", "")
    setup = dados.get("setup", 150)

    return f"""{_saudacao(nome_cliente)}🔗 *PROPOSTA - LINKTREE / LINK EM BIO*

📍 Cidade: {cidade}

✅ *O que está incluso:*
- Página personalizada com seus links principais
- Integração com redes sociais, WhatsApp e portfólio
- Design alinhado à sua identidade visual
- Hospedagem e configuração incluídas

💰 *Investimento:*
- Valor único: R$ {setup:,.0f}
- Sem mensalidade

⏱️ *Prazo de entrega:* 3 a 5 dias
💳 *Forma de pagamento:* 100% antecipado

Dúvidas? Estou à disposição!""".replace(",", ".")


def gerar_proposta_combo(dados: Dict[str, Any]) -> str:
    nome_cliente = dados.get("nome_cliente", "")
    cidade = dados.get("cidade", "")
    setup_aut = dados.get("setup_automacao", 0)
    setup_site = dados.get("setup_site", 0)
    subtotal = setup_aut + setup_site
    desconto = dados.get("desconto", 0)
    total_setup = dados.get("total_setup", 0)
    mens_aut = dados.get("mensalidade_automacao", 0)
    mens_site = dados.get("mensalidade_site", 0)
    total_mens = mens_aut + mens_site

    nome_pacote_aut = dados.get("nome_pacote", "Personalizado")
    servicos_aut = dados.get("servicos", [])
    lista_aut = "\n".join(f"  - {s}" for s in servicos_aut)

    tipo_site = dados.get("tipo_site", "")
    nivel_design = dados.get("nivel_design", "")
    funcionalidades = dados.get("funcionalidades", [])
    prazo_site = dados.get("prazo_site", "30 dias")
    nome_plano = dados.get("nome_plano", "")
    lista_func = "\n".join(f"  - {f}" for f in funcionalidades) if funcionalidades else "  - Nenhuma funcionalidade extra"

    return f"""{_saudacao(nome_cliente)}🎯 *PROPOSTA COMBO - AUTOMAÇÃO + SITE*

📍 Cidade: {cidade}

🤖 *AUTOMAÇÃO COM IA:*
  Pacote: {nome_pacote_aut}
  Serviços inclusos:
{lista_aut}

🌐 *SITE PROFISSIONAL:*
  Tipo: {tipo_site}
  Design: {nivel_design}
  Prazo: {prazo_site}
  Funcionalidades:
{lista_func}

💰 *Investimento:*
- Setup automação: R$ {setup_aut:,.0f}
- Setup site: R$ {setup_site:,.0f}
- Subtotal: R$ {subtotal:,.0f}
- 🎁 Desconto combo (10%): -R$ {desconto:,.0f}
- *Total setup: R$ {total_setup:,.0f}*

- Mensalidade automação: R$ {mens_aut:,.0f}/mês
- Mensalidade site: R$ {mens_site:,.0f}/mês
- *Total mensal: R$ {total_mens:,.0f}/mês*

⏱️ *Prazo de entrega:* 45 dias (combo)
💳 *Forma de pagamento:* 50% na assinatura + 50% na entrega

💎 Você economiza R$ {desconto:,.0f} fechando o combo!

Dúvidas? Estou à disposição!""".replace(",", ".")
