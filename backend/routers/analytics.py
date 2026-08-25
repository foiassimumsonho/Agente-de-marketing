from fastapi import APIRouter, Query, HTTPException
import httpx

router = APIRouter()

@router.get("/properties")
async def list_properties(token: str = Query(...)):
    """Lista propriedades GA4 disponíveis"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
            headers={"Authorization": f"Bearer {token}"}
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    return res.json()

@router.get("/report")
async def get_report(
    token: str = Query(...),
    property_id: str = Query(...),
    start_date: str = Query("30daysAgo"),
    end_date: str = Query("today")
):
    """Relatório principal de métricas GA4"""
    body = {
        "dateRanges": [{"startDate": start_date, "endDate": end_date}],
        "dimensions": [
            {"name": "sessionDefaultChannelGroup"},
            {"name": "deviceCategory"}
        ],
        "metrics": [
            {"name": "sessions"},
            {"name": "activeUsers"},
            {"name": "newUsers"},
            {"name": "bounceRate"},
            {"name": "averageSessionDuration"},
            {"name": "conversions"},
            {"name": "totalRevenue"},
        ]
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=body
        )
    if res.status_code != 200:
        raise HTTPException(res.status_code, res.text)
    return res.json()

@router.get("/top-pages")
async def get_top_pages(
    token: str = Query(...),
    property_id: str = Query(...),
):
    body = {
        "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "pagePath"}, {"name": "pageTitle"}],
        "metrics": [{"name": "screenPageViews"}, {"name": "averageSessionDuration"}],
        "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit": 10
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=body
        )
    return res.json()

@router.get("/realtime")
async def get_realtime(token: str = Query(...), property_id: str = Query(...)):
    body = {
        "dimensions": [{"name": "country"}, {"name": "deviceCategory"}],
        "metrics": [{"name": "activeUsers"}]
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runRealtimeReport",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=body
        )
    return res.json()
