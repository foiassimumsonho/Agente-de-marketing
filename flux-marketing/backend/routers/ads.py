from fastapi import APIRouter

router = APIRouter(prefix="/ads", tags=["Google Ads"])

@router.get("/status")
def status() -> dict[str, str]:
    return {"provider": "google_ads", "mode": "recommendations_only", "activation": "approval_required"}
