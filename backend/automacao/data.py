SERVICOS = [
    {"id": "atendimento_ia", "nome": "Atendimento personalizado com IA", "preco_base": 1000, "peso": 2},
    {"id": "agendamento_calendar", "nome": "Agendamento Google Calendar", "preco_base": 800, "peso": 2},
    {"id": "followup_pos_consulta", "nome": "Follow-up pós-consulta", "preco_base": 500, "peso": 1},
    {"id": "lembretes_consulta", "nome": "Lembretes de consulta", "preco_base": 400, "peso": 1},
    {"id": "confirmacao_presenca", "nome": "Confirmação de presença", "preco_base": 500, "peso": 1},
    {"id": "recuperacao_inativos", "nome": "Recuperação de inativos", "preco_base": 900, "peso": 1},
    {"id": "triagem_sintomas", "nome": "Triagem por sintomas", "preco_base": 1200, "peso": 2},
    {"id": "nps_satisfacao", "nome": "NPS / Satisfação", "preco_base": 400, "peso": 1},
    {"id": "aniversariantes", "nome": "Aniversariantes", "preco_base": 250, "peso": 1},
    {"id": "cobranca_inadimplentes", "nome": "Cobrança de inadimplentes", "preco_base": 700, "peso": 1},
    {"id": "captacao_leads", "nome": "Captação e qualificação de leads", "preco_base": 1200, "peso": 2},
    {"id": "segunda_via_docs", "nome": "Segunda via de documentos", "preco_base": 500, "peso": 1},
]

PACOTES = [
    {
        "id": "basic",
        "nome": "BASIC",
        "servicos_ids": ["atendimento_ia", "lembretes_consulta", "confirmacao_presenca"],
        "setup_base": 1600,
        "mensalidade_base": 600,
        "mensalidade_alto": 600,
        "destaque": False,
    },
    {
        "id": "plus",
        "nome": "PLUS",
        "servicos_ids": ["atendimento_ia", "agendamento_calendar", "lembretes_consulta", "confirmacao_presenca", "followup_pos_consulta"],
        "setup_base": 2500,
        "mensalidade_base": 750,
        "mensalidade_alto": 750,
        "destaque": True,
    },
    {
        "id": "advanced",
        "nome": "ADVANCED",
        "servicos_ids": ["atendimento_ia", "agendamento_calendar", "lembretes_consulta", "confirmacao_presenca", "followup_pos_consulta", "recuperacao_inativos", "nps_satisfacao", "aniversariantes"],
        "setup_base": 3500,
        "mensalidade_base": 900,
        "mensalidade_alto": 900,
        "destaque": False,
    },
]
