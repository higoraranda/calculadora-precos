from pydantic import BaseModel, Field
from typing import List, Optional

class CalcularSiteRequest(BaseModel):
    cidade: str
    multiplicador_cidade: float = Field(gt=0)
    tipo_id: str
    total_paginas: int = Field(ge=1)
    design_id: str
    funcionalidades_ids: List[str] = []
    conteudo_id: str
    banco_imagens: bool = False
    prazo_id: str
    plano_id: str

class ResultadoSite(BaseModel):
    cidade: str
    multiplicador: float
    tipo_nome: str
    total_paginas: int
    paginas_inclusas: int
    paginas_extras: int
    preco_pagina_extra: float
    design_nome: str
    multiplicador_design: float
    funcionalidades: List[str]
    opcao_conteudo: str
    banco_imagens: bool
    prazo_texto: str
    multiplicador_prazo: float
    nome_plano: str
    descricao_plano: str
    setup: int
    mensalidade: int
    detalhamento: dict
