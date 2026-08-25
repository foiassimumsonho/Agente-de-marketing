"""Camada de compatibilidade da arquitetura flux-marketing.

O runtime oficial da plataforma continua sendo o app React + Express do projeto.
Este módulo organiza futuras integrações FastAPI sem habilitar publicação automática.
"""
from fastapi import FastAPI
from routers import instagram, google_auth, analytics, ads, merchant, chat

app = FastAPI(title="FLUX Marketing API", version="0.1.0")
for router in (instagram.router, google_auth.router, analytics.router, ads.router, merchant.router, chat.router):
    app.include_router(router, prefix="/api")

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "approval_required"}
