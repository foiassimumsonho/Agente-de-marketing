from fastapi import APIRouter, Query, HTTPException
import httpx, os

router = APIRouter()

DEVELOPER_TOKEN = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN")

def ads_headers(token: str, customer_id: str):
    return {
        "Authorization": f"Bearer {token}",
        "developer-token": DEVELOPER_TOKEN,
        "login-customer-id": customer_id,
    }

@router.get("/customers")
async def list_customers(token: str = Query(...)):
    """Lista contas Google Ads acessíveis"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://googleads.googleapis.com/v16/customers:listAccessibleCustomers",
            headers={"Authorization": f"Bearer {token}", "developer-token": DEVELOPER_TOKEN}
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    return res.json()

@router.get("/campaigns")
async def get_campaigns(token: str = Query(...), customer_id: str = Query(...)):
    """Lista campanhas com métricas dos últimos 30 dias"""
    query = """
        SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.advertising_channel_type,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc,
            metrics.conversion_rate
        FROM campaign
        WHERE segments.date DURING LAST_30_DAYS
        ORDER BY metrics.cost_micros DESC
    """
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://googleads.googleapis.com/v16/customers/{customer_id}/googleAds:search",
            headers=ads_headers(token, customer_id),
            json={"query": query}
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    return res.json()

@router.get("/keywords")
async def get_keywords(token: str = Query(...), customer_id: str = Query(...)):
    """Top palavras-chave por performance"""
    query = """
        SELECT
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.quality_info.quality_score,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr
        FROM keyword_view
        WHERE segments.date DURING LAST_30_DAYS
        ORDER BY metrics.clicks DESC
        LIMIT 20
    """
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://googleads.googleapis.com/v16/customers/{customer_id}/googleAds:search",
            headers=ads_headers(token, customer_id),
            json={"query": query}
        )
    return res.json()

@router.get("/summary")
async def get_account_summary(token: str = Query(...), customer_id: str = Query(...)):
    """Resumo geral da conta Google Ads"""
    query = """
        SELECT
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc,
            metrics.conversion_rate,
            metrics.cost_per_conversion
        FROM customer
        WHERE segments.date DURING LAST_30_DAYS
    """
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://googleads.googleapis.com/v16/customers/{customer_id}/googleAds:search",
            headers=ads_headers(token, customer_id),
            json={"query": query}
        )
    return res.json()
