from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["Google Analytics 4"])

@router.get("/status")
def status() -> dict[str, str]:
    return {"provider": "google_analytics_4", "mode": "metrics_read_only"}
