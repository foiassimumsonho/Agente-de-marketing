from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["Agente FLUX"])

@router.get("/status")
def status() -> dict[str, str]:
    return {"agent": "FLUX", "capabilities": "archetype_posts_recommendations", "approval": "required", "publishing": "disabled"}
