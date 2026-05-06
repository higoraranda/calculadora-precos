from typing import List
from .data import TIPOS_PROJETO, COMPLEXIDADES_DESIGN, FUNCIONALIDADES, OPCOES_CONTEUDO, PRAZOS, PLANOS_MENSAIS
from ..shared.utils import arredondar_dezena, multiplicador_mensalidade_site

TIPOS_MAP = {t["id"]: t for t in TIPOS_PROJETO}
DESIGN_MAP = {d["id"]: d for d in COMPLEXIDADES_DESIGN}
FUNC_MAP = {f["id"]: f for f in FUNCIONALIDADES}
CONTEUDO_MAP = {c["id"]: c for c in OPCOES_CONTEUDO}
PRAZO_MAP = {p["id"]: p for p in PRAZOS}
PLANO_MAP = {p["id"]: p for p in PLANOS_MENSAIS}


def get_tipos():
    return TIPOS_PROJETO


def calcular_linktree(cidade: str) -> dict:
    """Linktree: preço fixo de R$150, sem perguntas adicionais."""
    return {
        "cidade": cidade,
        "tipo_nome": "Linktree / Link em Bio",
        "setup": 150,
        "mensalidade": 0,
        "prazo_texto": "3 a 5 dias úteis",
        "is_linktree": True,
    }


def get_funcionalidades():
    return FUNCIONALIDADES


def get_planos_com_precos(multiplicador: float, setup: float = 0.0) -> List[dict]:
    mult_setup = multiplicador_mensalidade_site(setup) if setup > 0 else 1.0
    result = []
    for p in PLANOS_MENSAIS:
        preco_final = arredondar_dezena(p["preco_base"] * multiplicador * mult_setup)
        result.append({**p, "preco_final": preco_final, "mult_setup": mult_setup})
    return result


def calcular_site(
    cidade: str,
    multiplicador_cidade: float,
    tipo_id: str,
    total_paginas: int,
    design_id: str,
    funcionalidades_ids: List[str],
    conteudo_id: str,
    banco_imagens: bool,
    prazo_id: str,
    plano_id: str,
) -> dict:
    tipo = TIPOS_MAP.get(tipo_id)
    design = DESIGN_MAP.get(design_id)
    conteudo = CONTEUDO_MAP.get(conteudo_id)
    prazo = PRAZO_MAP.get(prazo_id)
    plano = PLANO_MAP.get(plano_id)

    if not all([tipo, design, conteudo, prazo, plano]):
        raise ValueError("Parâmetros inválidos")

    paginas_extras = max(0, total_paginas - tipo["paginas_inclusas"])
    preco_extras = paginas_extras * tipo["preco_pagina_extra"]

    funcionalidades_selecionadas = [FUNC_MAP[fid] for fid in funcionalidades_ids if fid in FUNC_MAP]
    soma_funcionalidades = sum(f["preco_base"] for f in funcionalidades_selecionadas)

    if conteudo["por_pagina"]:
        preco_conteudo = conteudo["preco_base"] * total_paginas
    else:
        preco_conteudo = conteudo["preco_base"]

    preco_banco_imagens = 200 if banco_imagens else 0

    subtotal = (
        tipo["preco_base"]
        + preco_extras
        + soma_funcionalidades
        + preco_conteudo
        + preco_banco_imagens
    )

    setup_float = subtotal * design["multiplicador"] * prazo["multiplicador"] * multiplicador_cidade
    setup = arredondar_dezena(setup_float)

    mult_mensalidade = multiplicador_mensalidade_site(setup)
    mensalidade = arredondar_dezena(plano["preco_base"] * multiplicador_cidade * mult_mensalidade)

    return {
        "cidade": cidade,
        "multiplicador": multiplicador_cidade,
        "tipo_nome": tipo["nome"],
        "total_paginas": total_paginas,
        "paginas_inclusas": tipo["paginas_inclusas"],
        "paginas_extras": paginas_extras,
        "preco_pagina_extra": tipo["preco_pagina_extra"],
        "design_nome": design["nome"],
        "multiplicador_design": design["multiplicador"],
        "funcionalidades": [f["nome"] for f in funcionalidades_selecionadas],
        "opcao_conteudo": conteudo["nome"],
        "banco_imagens": banco_imagens,
        "prazo_texto": prazo["texto"],
        "multiplicador_prazo": prazo["multiplicador"],
        "nome_plano": plano["nome"],
        "descricao_plano": plano["descricao"],
        "setup": setup,
        "mensalidade": mensalidade,
        "mult_mensalidade": mult_mensalidade,
        "detalhamento": {
            "tipo_preco": tipo["preco_base"],
            "paginas_extras_preco": preco_extras,
            "funcionalidades_preco": soma_funcionalidades,
            "conteudo_preco": preco_conteudo,
            "banco_imagens_preco": preco_banco_imagens,
            "subtotal_antes_multiplicadores": subtotal,
            "mult_design": design["multiplicador"],
            "mult_prazo": prazo["multiplicador"],
            "mult_cidade": multiplicador_cidade,
            "mult_mensalidade": mult_mensalidade,
        },
    }
