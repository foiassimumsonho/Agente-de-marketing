from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx, os

router = APIRouter()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

SYSTEM_PROMPT = """Você é o FLUX — Gestor Estratégico de Marketing Digital com acesso em tempo real aos dados integrados do usuário (Instagram, Google Analytics, Google Ads, Google Merchant Center).

Quando dados forem fornecidos no contexto, analise-os com profundidade e ofereça insights acionáveis.

Suas especialidades:
- Copywriting e criação de conteúdo persuasivo
- Briefing estratégico para campanhas
- Persona, arquétipos de Jung e posicionamento de marca
- Google Analytics 4: interpretação de métricas, funis, comportamento
- Google Ads: estrutura de campanhas, palavras-chave, bidding, Quality Score, remarketing
- Google Merchant Center: análise de produtos, aprovações, performance de shopping
- Instagram: estratégia de conteúdo, crescimento, engajamento, algoritmo
- Inbound Marketing e geração de leads
- Estratégias de venda online (lançamento, perpétuo, funil)
- Sugestão de posts, stories, reels e dinâmicas interativas
- Publicidade e propaganda (Meta Ads, Google Ads, TikTok Ads)
- Melhorias de produto e posicionamento

Responda sempre em português brasileiro. Seja estratégico, direto e termine com uma ação concreta.
Use markdown para formatar quando útil."""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    context: Optional[dict] = None  # dados das integrações

@router.post("/")
async def chat(req: ChatRequest):
    if not ANTHROPIC_API_KEY:
        raise HTTPException(500, "ANTHROPIC_API_KEY não configurada")

    # Monta contexto com dados reais das integrações
    context_text = ""
    if req.context:
        ig = req.context.get("instagram")
        ga = req.context.get("analytics")
        ads = req.context.get("ads")
        merchant = req.context.get("merchant")

        if ig:
            context_text += f"\n\n[DADOS INSTAGRAM]\n{ig}"
        if ga:
            context_text += f"\n\n[DADOS GOOGLE ANALYTICS 4]\n{ga}"
        if ads:
            context_text += f"\n\n[DADOS GOOGLE ADS]\n{ads}"
        if merchant:
            context_text += f"\n\n[DADOS MERCHANT CENTER]\n{merchant}"

    system = SYSTEM_PROMPT
    if context_text:
        system += f"\n\nDADOS REAIS DO USUÁRIO (use para análises):{context_text}"

    messages = [{"role": m.role, "content": m.content} for m in req.messages]

    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1500,
                "system": system,
                "messages": messages
            }
        )

    if res.status_code != 200:
        raise HTTPException(res.status_code, f"Erro Anthropic: {res.text}")

    data = res.json()
    return {"reply": data["content"][0]["text"]}
