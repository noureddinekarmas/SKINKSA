import time

import httpx

from app.core.config import settings
from app.services.hashing import hash_geo_field, hash_phone_for_snap

SNAP_CAPI_URL = "https://tr.snapchat.com/v2/conversion"


async def send_snap_capi_event(
    event_name: str,
    event_id: str,
    value: float,
    currency: str,
    phone_digits: str,
    source_url: str,
    ip_address: str,
    user_agent: str,
    snap_click_id: str | None,
    order_id: str | None = None,
    geo: dict | None = None,
) -> dict:
    """
    geo dict keys (all optional): country_iso, city, subdivision, postal_code
    """
    if (
        not settings.SNAP_CAPI_ENABLED
        or not settings.SNAP_PIXEL_ID
        or not settings.SNAP_ACCESS_TOKEN
    ):
        return {"skipped": True, "reason": "SNAP_CAPI_ENABLED=false or missing config"}

    hashed_phone = hash_phone_for_snap(phone_digits)

    user_data: dict = {
        "ph": hashed_phone,
        "client_ip_address": ip_address,
        "client_user_agent": user_agent,
    }

    if geo:
        if h := hash_geo_field(geo.get("city")):
            user_data["ct"] = h
        if h := hash_geo_field(geo.get("subdivision")):
            user_data["st"] = h
        if h := hash_geo_field(geo.get("postal_code")):
            user_data["zp"] = h
        if h := hash_geo_field(geo.get("country_iso")):
            user_data["country"] = h

    data: dict = {
        "pixel_id": settings.SNAP_PIXEL_ID,
        "event_type": event_name,
        "event_conversion_type": "WEB",
        "timestamp": str(int(time.time() * 1000)),
        "uuid_c1": event_id,
        "user_data": user_data,
        "custom_data": {
            "value": str(value),
            "currency": currency,
        },
    }
    if snap_click_id:
        data["click_id"] = snap_click_id

    headers = {
        "Authorization": f"Bearer {settings.SNAP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(SNAP_CAPI_URL, headers=headers, json=data)
        return {"status_code": resp.status_code, "body": resp.json() if resp.content else {}}
