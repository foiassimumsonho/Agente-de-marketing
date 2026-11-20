from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from .routers import instagram, google_auth, analytics, ads, merchant, chat

app = FastAPI(title="FLUX Marketing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(instagram.router, prefix="/api/instagram", tags=["Instagram"])
app.include_router(google_auth.router, prefix="/api/google", tags=["Google Auth"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(ads.router, prefix="/api/ads", tags=["Google Ads"])
app.include_router(merchant.router, prefix="/api/merchant", tags=["Merchant Center"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_dir):
    app.mount("/assets", StaticFiles(directory=frontend_dir), name="static")

@app.get("/")
def root():
    index = os.path.join(os.path.dirname(__file__), "..", "frontend", "index.html")
    if os.path.exists(index):
        return FileResponse(index)
    return {"status": "FLUX API online", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
