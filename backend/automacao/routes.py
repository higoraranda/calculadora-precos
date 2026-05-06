from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from .services import get_servicos_com_precos, get_pacotes_com_precos, calcular_automacao
from .models import CalcularAutomacaoRequest

router = APIRouter(prefix="/automacao", tags=["automacao"])


@router.get("/servicos")
def listar_servicos(multiplicador: float = Query(1.0, gt=0)):
    return get_servicos_com_precos(multiplicador)


@router.get("/pacotes")
def listar_pacotes(multiplicador: float = Query(1.0, gt=0)):
    return get_pacotes_com_precos(multiplicador)


@router.post("/calcular")
def calcular(req: CalcularAutomacaoRequest):
    try:
        return calcular_automacao(
            cidade=req.cidade,
            multiplicador=req.multiplicador_cidade,
            modo=req.modo,
            pacote_id=req.pacote_id,
            servicos_ids=req.servicos_ids,
            extra_servicos_ids=req.extra_servicos_ids,
            num_funcionarios=req.num_funcionarios,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
