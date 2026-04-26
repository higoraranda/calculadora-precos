from pydantic import BaseModel, Field
from typing import List, Optional

class CalcularAutomacaoRequest(BaseModel):
    cidade: str
    multiplicador_cidade: float = Field(gt=0)
    modo: str = Field(description="'pacote' ou 'personalizado'")
    pacote_id: Optional[str] = None
    servicos_ids: Optional[List[str]] = None

class ServicoResponse(BaseModel):
    id: str
    nome: str
    preco_base: float
    preco_final: float
    peso: int

class PacoteResponse(BaseModel):
    id: str
    nome: str
    servicos: List[str]
    setup_base: float
    setup_final: float
    mensalidade_base: float
    mensalidade_final: float
    economia: float
    destaque: bool

class ResultadoAutomacao(BaseModel):
    cidade: str
    multiplicador: float
    modo: str
    nome_pacote: str
    servicos: List[str]
    setup: int
    mensalidade: int
    economia: int
    detalhamento: dict
