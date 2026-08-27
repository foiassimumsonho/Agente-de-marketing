from fastapi import APIRouter, Query, HTTPException
import httpx

router = APIRouter()

@router.get("/accounts")
async def list_accounts(token: str = Query(...)):
    """Lista contas do Merchant Center"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://shoppingcontent.googleapis.com/content/v2.1/accounts/authinfo",
            headers={"Authorization": f"Bearer {token}"}
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    return res.json()

@router.get("/products")
async def get_products(token: str = Query(...), merchant_id: str = Query(...)):
    """Lista produtos cadastrados no Merchant Center"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"https://shoppingcontent.googleapis.com/content/v2.1/{merchant_id}/products",
            headers={"Authorization": f"Bearer {token}"},
            params={"maxResults": 50}
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    return res.json()

@router.get("/product-statuses")
async def get_product_statuses(token: str = Query(...), merchant_id: str = Query(...)):
    """Status de aprovação dos produtos (aprovados, reprovados, pendentes)"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"https://shoppingcontent.googleapis.com/content/v2.1/{merchant_id}/productstatuses",
            headers={"Authorization": f"Bearer {token}"},
            params={"maxResults": 50}
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    data = res.json()
    
    approved = sum(1 for p in data.get("resources", []) if not p.get("itemLevelIssues"))
    disapproved = sum(1 for p in data.get("resources", []) if any(
        i.get("servability") == "disapproved" for i in p.get("itemLevelIssues", [])
    ))
    pending = sum(1 for p in data.get("resources", []) if p.get("creationDate") and not p.get("lastUpdateDate"))
    
    return {
        "summary": {"approved": approved, "disapproved": disapproved, "pending": pending, "total": len(data.get("resources", []))},
        "products": data.get("resources", [])
    }

@router.get("/performance")
async def get_performance(token: str = Query(...), merchant_id: str = Query(...)):
    """Métricas de performance dos produtos via Reports API"""
    body = {
        "query": """
            SELECT
                segments.date,
                metrics.clicks,
                metrics.impressions,
                metrics.ctr
            FROM MerchantPerformanceView
            WHERE segments.date BETWEEN '2024-01-01' AND '2024-12-31'
        """
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://merchantapi.googleapis.com/reports/v1beta/{merchant_id}/reports:search",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=body
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    return res.json()
