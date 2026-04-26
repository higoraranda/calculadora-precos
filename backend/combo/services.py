from ..shared.utils import arredondar_dezena


def calcular_combo(resultado_automacao: dict, resultado_site: dict) -> dict:
    setup_aut = resultado_automacao["setup"]
    setup_site = resultado_site["setup"]
    subtotal = setup_aut + setup_site
    desconto = arredondar_dezena(subtotal * 0.10)
    total_setup = subtotal - desconto

    mens_aut = resultado_automacao["mensalidade"]
    mens_site = resultado_site["mensalidade"]
    total_mens = mens_aut + mens_site

    return {
        "cidade": resultado_automacao["cidade"],
        "setup_automacao": setup_aut,
        "setup_site": setup_site,
        "subtotal_setup": subtotal,
        "desconto": desconto,
        "total_setup": total_setup,
        "mensalidade_automacao": mens_aut,
        "mensalidade_site": mens_site,
        "total_mensalidade": total_mens,
        "automacao": resultado_automacao,
        "site": resultado_site,
    }
