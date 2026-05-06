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
            "servicos_ids": p["servicos_ids"],  # exposto para o frontend personalizar
            "setup_final": setup_final,
            "mensalidade_final": mensalidade_final,
            "economia": economia,
        })
    return result


def calcular_automacao(cidade: str, multiplicador: float, modo: str,
                        pacote_id: Optional[str] = None,
                        servicos_ids: Optional[List[str]] = None,
                        extra_servicos_ids: Optional[List[str]] = None,
                        num_funcionarios: int = 1) -> dict:
    # 2% de acréscimo por funcionário adicional (a partir do 2º)
    mult_func = 1.0 + max(0, num_funcionarios - 1) * 0.02

    if modo == "pacote" and pacote_id:
        pacote = PACOTES_MAP.get(pacote_id)
        if not pacote:
            raise ValueError(f"Pacote '{pacote_id}' não encontrado")

        setup_sem_func = arredondar_dezena(pacote["setup_base"] * multiplicador)
        mensalidade_sem_func = arredondar_dezena(
            pacote["mensalidade_alto"] * multiplicador if multiplicador >= 1.4 else pacote["mensalidade_base"] * multiplicador
        )
        servicos_nomes = [SERVICOS_MAP[sid]["nome"] for sid in pacote["servicos_ids"] if sid in SERVICOS_MAP]
        soma_avulso = sum(
            arredondar_dezena(SERVICOS_MAP[sid]["preco_base"] * multiplicador)
            for sid in pacote["servicos_ids"] if sid in SERVICOS_MAP
        )

        setup = arredondar_dezena(setup_sem_func * mult_func)
        mensalidade = arredondar_dezena(mensalidade_sem_func * mult_func)
        soma_avulso_final = arredondar_dezena(soma_avulso * mult_func)
        economia = max(0, soma_avulso_final - setup)

        return {
            "cidade": cidade,
            "multiplicador": multiplicador,
            "modo": "pacote",
            "nome_pacote": pacote["nome"],
            "servicos": servicos_nomes,
            "setup": setup,
            "mensalidade": mensalidade,
            "economia": economia,
            "num_funcionarios": num_funcionarios,
            "detalhamento": {
                "setup_base": pacote["setup_base"],
                "soma_avulso": soma_avulso_final,
                "acrescimo_equipe_pct": round((mult_func - 1) * 100, 1),
            },
        }

    elif modo == "pacote_personalizado" and pacote_id:
        pacote = PACOTES_MAP.get(pacote_id)
        if not pacote:
            raise ValueError(f"Pacote '{pacote_id}' não encontrado")

        extras = extra_servicos_ids or []

        # Avulso e setup do pacote base (com multiplicador de cidade)
        soma_avulso_base = sum(
            arredondar_dezena(SERVICOS_MAP[sid]["preco_base"] * multiplicador)
            for sid in pacote["servicos_ids"] if sid in SERVICOS_MAP
        )
        setup_base = arredondar_dezena(pacote["setup_base"] * multiplicador)

        # Razão de desconto do pacote original (ex: 1600/1900 = 0.842...)
        discount_ratio = setup_base / soma_avulso_base if soma_avulso_base > 0 else 1.0

        # Extras: só aceita serviços fora do pacote
        ids_no_pacote = set(pacote["servicos_ids"])
        extras_validos = [sid for sid in extras if sid in SERVICOS_MAP and sid not in ids_no_pacote]
        soma_extras = sum(
            arredondar_dezena(SERVICOS_MAP[sid]["preco_base"] * multiplicador)
            for sid in extras_validos
        )

        # Novo total avulso e setup com mesmo % de desconto
        nova_soma_avulso = soma_avulso_base + soma_extras
        setup_sem_func = arredondar_dezena(nova_soma_avulso * discount_ratio)

        mensalidade_sem_func = arredondar_dezena(
            pacote["mensalidade_alto"] * multiplicador if multiplicador >= 1.4 else pacote["mensalidade_base"] * multiplicador
        )

        setup = arredondar_dezena(setup_sem_func * mult_func)
        mensalidade = arredondar_dezena(mensalidade_sem_func * mult_func)
        nova_soma_avulso_final = arredondar_dezena(nova_soma_avulso * mult_func)
        economia = max(0, nova_soma_avulso_final - setup)

        todos_ids = list(pacote["servicos_ids"]) + extras_validos
        servicos_nomes = [SERVICOS_MAP[sid]["nome"] for sid in todos_ids if sid in SERVICOS_MAP]

        return {
            "cidade": cidade,
            "multiplicador": multiplicador,
            "modo": "pacote_personalizado",
            "nome_pacote": f"{pacote['nome']} Personalizado",
            "servicos": servicos_nomes,
            "setup": setup,
            "mensalidade": mensalidade,
            "economia": economia,
            "num_funcionarios": num_funcionarios,
            "detalhamento": {
                "pacote_base": pacote["nome"],
                "setup_base": setup_base,
                "soma_avulso_base": soma_avulso_base,
                "soma_extras": soma_extras,
                "nova_soma_avulso": nova_soma_avulso_final,
                "discount_ratio": round(discount_ratio, 4),
                "desconto_percentual": round((1 - discount_ratio) * 100, 1),
                "acrescimo_equipe_pct": round((mult_func - 1) * 100, 1),
            },
        }

    elif modo == "personalizado" and servicos_ids:
        servicos_selecionados = [SERVICOS_MAP[sid] for sid in servicos_ids if sid in SERVICOS_MAP]
        soma_setup = sum(s["preco_base"] for s in servicos_selecionados)
        peso_total = sum(s["peso"] for s in servicos_selecionados)

        setup_sem_func = arredondar_dezena(soma_setup * multiplicador)

        if multiplicador >= 1.4:
            mensalidade_basic = 600
            mensalidade_plus = 950
        else:
            mensalidade_basic = 500
            mensalidade_plus = 800

        mensalidade_base = mensalidade_basic if peso_total <= 3 else mensalidade_plus
        mensalidade_sem_func = arredondar_dezena(mensalidade_base * multiplicador)

        setup = arredondar_dezena(setup_sem_func * mult_func)
        mensalidade = arredondar_dezena(mensalidade_sem_func * mult_func)

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
            "num_funcionarios": num_funcionarios,
            "detalhamento": {
                "soma_base": soma_setup,
                "peso_total": peso_total,
                "acrescimo_equipe_pct": round((mult_func - 1) * 100, 1),
            },
        }
    else:
        raise ValueError("Parâmetros inválidos")
