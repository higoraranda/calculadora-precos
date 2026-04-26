import math

def arredondar_dezena(valor: float) -> int:
    return int(round(valor / 10) * 10)

def formatar_brl(valor: float) -> str:
    return f"R$ {valor:,.0f}".replace(",", ".")
