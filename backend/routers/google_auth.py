from fastapi import APIRouter, Query
from fastapi.responses import RedirectResponse
import httpx, os

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
REDIRECT_URI = BACKEND_URL + "/api/google/callback"

SCOPES = " ".join([
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/adwords",
    "https://www.googleapis.com/auth/content",
    "openid email profile"
])

@router.get("/auth")
def google_auth():
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope={SCOPES}"
        "&access_type=offline"
        "&prompt=consent"
    )
    return RedirectResponse(url)

@router.get("/callback")
async def google_callback(code: str = Query(...)):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": REDIRECT_URI,
                "grant_type": "authorization_code",
            }
        )
        tokens = res.json()

    access_token = tokens.get("access_token", "")
    refresh_token = tokens.get("refresh_token", "")
    # Em produção: salve refresh_token no banco de dados
    return RedirectResponse(
        f"{FRONTEND_URL}?g_token={access_token}&g_refresh={refresh_token}"
    )

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            }
        )
    return res.json()
