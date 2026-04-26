from typing import List, Optional
from .data import SERVICOS, PACOTES
from ..shared.utils import arredondar_dezena

SERVICOS_MAP = {s["id"]: s for s in SERVICOS}
PACOTES_MAP = {p["id"]: p for p in PACOTES}


def get_servicos_com_precos(multiplicador: float) -> List[dict]:
    result = []
    for s in SERVICOS:
        preco_final = arredondar_dezena(s["preco_base"] * multiplicador)
        result.append({**s, "preco_final": preco_final})
    return result


def get_pacotes_com_precos(multiplicador: float) -> List[dict]:
    result = []
    for p in PACOTES:
        setup_final = arredondar_dezena(p["setup_base"] * multiplicador)
        mensalidade_final = arredondar_dezena(
            p["mensalidade_alto"] * multiplicador if multiplicador >= 1.4 else p["mensalidade_base"] * multiplicador
        )
        servicos_nomes = [SERVICOS_MAP[sid]["nome"] for sid in p["servicos_ids"] if sid in SERVICOS_MAP]
        soma_avulso = sum(
            arredondar_dezena(SERVICOS_MAP[sid]["preco_base"] * multiplicador)
            for sid in p["servicos_ids"] if sid in SERVICOS_MAP
        )
        economia = max(0, soma_avulso - setup_final)
        result.append({
            **p,
            "servicos": servicos_nomes,
            "setup_final": setup_final,
            "mensalidade_final": mensalidade_final,
            "economia": economia,
        })
    return result


def calcular_automacao(cidade: str, multiplicador: float, modo: str,
                        pacote_id: Optional[str] = None,
                        servicos_ids: Optional[List[str]] = None) -> dict:
    if modo == "pacote" and pacote_id:
        pacote = PACOTES_MAP.get(pacote_id)
        if not pacote:
            raise ValueError(f"Pacote '{pacote_id}' não encontrado")

        setup = arredondar_dezena(pacote["setup_base"] * multiplicador)
        mensalidade = arredondar_dezena(
            pacote["mensalidade_alto"] * multiplicador if multiplicador >= 1.4 else pacote["mensalidade_base"] * multiplicador
        )
        servicos_nomes = [SERVICOS_MAP[sid]["nome"] for sid in pacote["servicos_ids"] if sid in SERVICOS_MAP]
        soma_avulso = sum(
            arredondar_dezena(SERVICOS_MAP[sid]["preco_base"] * multiplicador)
            for sid in pacote["servicos_ids"] if sid in SERVICOS_MAP
        )
        economia = max(0, soma_avulso - setup)

        return {
            "cidade": cidade,
            "multiplicador": multiplicador,
            "modo": "pacote",
            "nome_pacote": pacote["nome"],
            "servicos": servicos_nomes,
            "setup": setup,
            "mensalidade": mensalidade,
            "economia": economia,
            "detalhamento": {
                "setup_base": pacote["setup_base"],
                "soma_avulso": soma_avulso,
            },
        }

    elif modo == "personalizado" and servicos_ids:
        servicos_selecionados = [SERVICOS_MAP[sid] for sid in servicos_ids if sid in SERVICOS_MAP]
        soma_setup = sum(s["preco_base"] for s in servicos_selecionados)
        peso_total = sum(s["peso"] for s in servicos_selecionados)

        setup = arredondar_dezena(soma_setup * multiplicador)

        if multiplicador >= 1.4:
            mensalidade_basic = 600
            mensalidade_plus = 950
        else:
            mensalidade_basic = 500
            mensalidade_plus = 800

        mensalidade_base = mensalidade_basic if peso_total <= 3 else mensalidade_plus
        mensalidade = arredondar_dezena(mensalidade_base * multiplicador)

        servicos_nomes = [s["nome"] for s in servicos_selecionados]

        return {
            "cidade": cidade,
            "multiplicador": multiplicador,
            "modo": "personalizado",
            "nome_pacote": "Personalizado",
            "servicos": servicos_nomes,
            "setup": setup,
            "mensalidade": mensalidade,
            "economia": 0,
            "detalhamento": {
                "soma_base": soma_setup,
                "peso_total": peso_total,
            },
        }
    else:
        raise ValueError("Parâmetros inválidos")
