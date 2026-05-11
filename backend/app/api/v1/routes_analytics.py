import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.analytics_event import AnalyticsEvent
from app.schemas.analytics import AnalyticsEventIn
from app.services.geoip import lookup
from app.services.ip_intel_secondary import lookup_secondary_vpn
from app.services.traffic_validity import is_valid_ksa_non_vpn_traffic

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["analytics"])

_ALLOWED_EVENTS = frozenset({"page_view", "product_view", "add_to_cart", "begin_checkout"})


def _real_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else None


@router.post("/events", status_code=204)
async def collect_analytics_event(
    payload: AnalyticsEventIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    if payload.event_type not in _ALLOWED_EVENTS:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid event")

    ip = _real_ip(request)
    user_agent = request.headers.get("user-agent")
    geo = await lookup(ip)
    secondary_vpn = await lookup_secondary_vpn(ip)
    valid = is_valid_ksa_non_vpn_traffic(geo, secondary_vpn=secondary_vpn)

    row = AnalyticsEvent(
        event_type=payload.event_type,
        path=payload.path,
        product_slug=payload.product_slug,
        session_id=payload.session_id,
        ip_address=ip,
        user_agent=user_agent,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        geo_country=geo.country_iso,
        geo_is_vpn=geo.is_vpn,
        geo_is_proxy=geo.is_proxy,
        geo_is_tor=geo.is_tor,
        geo_is_hosting=geo.is_hosting,
        secondary_vpn_detected=secondary_vpn,
        is_valid_traffic=valid,
    )
    db.add(row)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.exception("analytics insert failed: %s", exc)
    return None
