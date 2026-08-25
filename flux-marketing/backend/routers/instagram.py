from fastapi import APIRouter

router = APIRouter(prefix="/instagram", tags=["Instagram / Meta"])

@router.get("/status")
def status() -> dict[str, str]:
    return {"provider": "meta_graph_api", "mode": "read_and_suggest_only", "publishing": "disabled"}
