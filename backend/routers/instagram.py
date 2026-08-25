from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
import httpx, os

router = APIRouter()

IG_APP_ID = os.getenv("META_APP_ID")
IG_APP_SECRET = os.getenv("META_APP_SECRET")
REDIRECT_URI = os.getenv("BACKEND_URL", "http://localhost:8000") + "/api/instagram/callback"

@router.get("/auth")
def instagram_auth():
    """Inicia OAuth do Instagram"""
    url = (
        f"https://www.facebook.com/v19.0/dialog/oauth"
        f"?client_id={IG_APP_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement"
        f"&response_type=code"
    )
    return RedirectResponse(url)

@router.get("/callback")
async def instagram_callback(code: str = Query(...)):
    """Recebe o code e troca por access token"""
    async with httpx.AsyncClient() as client:
        # Trocar code por token
        token_res = await client.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            params={
                "client_id": IG_APP_ID,
                "client_secret": IG_APP_SECRET,
                "redirect_uri": REDIRECT_URI,
                "code": code,
            }
        )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(400, "Falha ao obter token do Instagram")

        # Token de longa duração
        long_res = await client.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            params={
                "grant_type": "fb_exchange_token",
                "client_id": IG_APP_ID,
                "client_secret": IG_APP_SECRET,
                "fb_exchange_token": access_token,
            }
        )
        long_token = long_res.json().get("access_token", access_token)

    # Em produção: salve esse token num banco de dados
    # Por simplicidade, retornamos para o frontend via redirect
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    return RedirectResponse(f"{frontend_url}?ig_token={long_token}")

@router.get("/profile")
async def get_profile(token: str = Query(...)):
    """Retorna perfil e métricas do Instagram Business"""
    async with httpx.AsyncClient() as client:
        # Buscar páginas do Facebook
        pages_res = await client.get(
            "https://graph.facebook.com/v19.0/me/accounts",
            params={"access_token": token, "fields": "id,name,instagram_business_account"}
        )
        pages = pages_res.json().get("data", [])
        
        ig_account_id = None
        page_token = None
        for page in pages:
            if page.get("instagram_business_account"):
                ig_account_id = page["instagram_business_account"]["id"]
                page_token = page.get("access_token", token)
                break
        
        if not ig_account_id:
            raise HTTPException(404, "Nenhuma conta Instagram Business encontrada")

        # Dados do perfil IG
        profile_res = await client.get(
            f"https://graph.facebook.com/v19.0/{ig_account_id}",
            params={
                "fields": "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website",
                "access_token": page_token
            }
        )
        profile = profile_res.json()

        # Insights do perfil
        insights_res = await client.get(
            f"https://graph.facebook.com/v19.0/{ig_account_id}/insights",
            params={
                "metric": "impressions,reach,profile_views,follower_count",
                "period": "day",
                "access_token": page_token
            }
        )
        insights = insights_res.json().get("data", [])

        # Posts recentes
        media_res = await client.get(
            f"https://graph.facebook.com/v19.0/{ig_account_id}/media",
            params={
                "fields": "id,caption,media_type,timestamp,like_count,comments_count,insights.metric(reach,impressions,engagement)",
                "limit": 10,
                "access_token": page_token
            }
        )
        media = media_res.json().get("data", [])

    return {
        "profile": profile,
        "insights": insights,
        "recent_posts": media,
        "ig_account_id": ig_account_id,
        "page_token": page_token
    }

@router.get("/audience")
async def get_audience(token: str = Query(...), ig_id: str = Query(...)):
    """Dados de audiência do Instagram"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"https://graph.facebook.com/v19.0/{ig_id}/insights",
            params={
                "metric": "audience_city,audience_country,audience_gender_age",
                "period": "lifetime",
                "access_token": token
            }
        )
    return res.json()
