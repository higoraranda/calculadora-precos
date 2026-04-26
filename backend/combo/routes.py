from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..automacao.services import calcular_automacao
from ..automacao.models import CalcularAutomacaoRequest
from ..site.services import calcular_site
from ..site.models import CalcularSiteRequest
from .services import calcular_combo

router = APIRouter(prefix="/combo", tags=["combo"])


class ComboRequest(BaseModel):
    automacao: CalcularAutomacaoRequest
    site: CalcularSiteRequest


@router.post("/calcular")
def calcular(req: ComboRequest):
    try:
        res_aut = calcular_automacao(
            cidade=req.automacao.cidade,
            multiplicador=req.automacao.multiplicador_cidade,
            modo=req.automacao.modo,
            pacote_id=req.automacao.pacote_id,
            servicos_ids=req.automacao.servicos_ids,
        )
        res_site = calcular_site(
            cidade=req.site.cidade,
            multiplicador_cidade=req.site.multiplicador_cidade,
            tipo_id=req.site.tipo_id,
            total_paginas=req.site.total_paginas,
            design_id=req.site.design_id,
            funcionalidades_ids=req.site.funcionalidades_ids,
            conteudo_id=req.site.conteudo_id,
            banco_imagens=req.site.banco_imagens,
            prazo_id=req.site.prazo_id,
            plano_id=req.site.plano_id,
        )
        return calcular_combo(res_aut, res_site)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
