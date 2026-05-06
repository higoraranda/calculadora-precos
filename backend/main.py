from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .automacao.routes import router as automacao_router
from .site.routes import router as site_router
from .combo.routes import router as combo_router
from .shared.cidades import CIDADES, PRESETS_OUTRAS_CIDADES
from .shared.proposta import gerar_proposta_automacao, gerar_proposta_site, gerar_proposta_combo, gerar_proposta_linktree
from pydantic import BaseModel
from typing import Any, Dict

app = FastAPI(title="Calculadora de Preços - Serviços Digitais", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(automacao_router)
app.include_router(site_router)
app.include_router(combo_router)


@app.get("/cidades")
def listar_cidades():
    return {"cidades": CIDADES, "presets": PRESETS_OUTRAS_CIDADES}


class PropostaRequest(BaseModel):
    tipo: str
    dados: Dict[str, Any]


@app.post("/gerar-proposta")
def gerar_proposta(req: PropostaRequest):
    if req.tipo == "automacao":
        texto = gerar_proposta_automacao(req.dados)
    elif req.tipo == "site":
        texto = gerar_proposta_site(req.dados)
    elif req.tipo == "linktree":
        texto = gerar_proposta_linktree(req.dados)
    elif req.tipo == "combo":
        texto = gerar_proposta_combo(req.dados)
    else:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Tipo inválido")
    return {"texto": texto}


@app.get("/")
def root():
    return {"message": "Calculadora de Preços API", "version": "1.0.0"}
