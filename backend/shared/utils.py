import math

def arredondar_dezena(valor: float) -> int:
    return int(round(valor / 10) * 10)

def formatar_brl(valor: float) -> str:
    return f"R$ {valor:,.0f}".replace(",", ".")

def multiplicador_mensalidade_site(setup: float) -> float:
    """
    Calcula o multiplicador da mensalidade baseado no valor do setup do site.
    A cada R$ 1.000 de setup, o multiplicador aumenta 0.5 a partir de R$ 1.000.
    Cap em R$ 50.000.
      R$    0 –  R$  999 → ×1.0
      R$ 1000 –  R$ 1999 → ×1.5
      R$ 2000 –  R$ 2999 → ×2.0
      ...
      R$50000+            → ×26.0
    """
    bracket = min(int(setup // 1000), 50)
    return 1.0 + bracket * 0.5
