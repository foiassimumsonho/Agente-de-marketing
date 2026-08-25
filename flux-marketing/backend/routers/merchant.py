from fastapi import APIRouter

router = APIRouter(prefix="/merchant", tags=["Merchant Center"])

@router.get("/status")
def status() -> dict[str, str]:
    return {"provider": "google_merchant_center", "mode": "catalog_read_only"}
