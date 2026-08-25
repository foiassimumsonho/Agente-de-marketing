from fastapi import APIRouter

router = APIRouter(prefix="/auth/google", tags=["Google OAuth"])

@router.get("/status")
def status() -> dict[str, str]:
    return {"provider": "google_oauth", "status": "adapter_ready", "credentials": "environment_only"}
