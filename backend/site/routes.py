from fastapi import APIRouter, Query, HTTPException
from .services import get_tipos, get_funcionalidades, get_planos_com_precos, calcular_site
from .models import CalcularSiteRequest
from ..site.data import COMPLEXIDADES_DESIGN, OPCOES_CONTEUDO, PRAZOS

router = APIRouter(prefix="/site", tags=["site"])


@router.get("/tipos")
def listar_tipos():
    return get_tipos()


@router.get("/funcionalidades")
def listar_funcionalidades():
    return get_funcionalidades()


@router.get("/designs")
def listar_designs():
    return COMPLEXIDADES_DESIGN


@router.get("/conteudos")
def listar_conteudos():
    return OPCOES_CONTEUDO


@router.get("/prazos")
def listar_prazos():
    return PRAZOS


@router.get("/planos-mensais")
def listar_planos(multiplicador: float = Query(1.0, gt=0), setup: float = Query(0.0, ge=0)):
    return get_planos_com_precos(multiplicador, setup)


@router.post("/calcular")
def calcular(req: CalcularSiteRequest):
    try:
        return calcular_site(
            cidade=req.cidade,
            multiplicador_cidade=req.multiplicador_cidade,
            tipo_id=req.tipo_id,
            total_paginas=req.total_paginas,
            design_id=req.design_id,
            funcionalidades_ids=req.funcionalidades_ids,
            conteudo_id=req.conteudo_id,
            banco_imagens=req.banco_imagens,
            prazo_id=req.prazo_id,
            plano_id=req.plano_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
