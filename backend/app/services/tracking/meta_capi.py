import time

import httpx

from app.core.config import settings
from app.services.hashing import hash_phone_for_meta

META_CAPI_URL = "https://graph.facebook.com/v19.0/{pixel_id}/events"


async def send_meta_capi_event(
    event_name: str,
    event_id: str,
    value: float,
    currency: str,
    phone_digits: str,
    source_url: str,
    ip_address: str,
    user_agent: str,
    fbclid: str | None,
    contents: list[dict],
    order_id: str | None = None,
) -> dict:
    cfg = settings
    if not cfg.META_CAPI_ENABLED or not cfg.META_PIXEL_ID or not cfg.META_ACCESS_TOKEN:
        return {"skipped": True, "reason": "META_CAPI_ENABLED=false or missing config"}

    hashed_phone = hash_phone_for_meta(phone_digits)
    user_data: dict = {
        "ph": [hashed_phone],
        "client_ip_address": ip_address,
        "client_user_agent": user_agent,
    }
    if fbclid:
        user_data["fbc"] = f"fb.1.{int(time.time() * 1000)}.{fbclid}"

    event_data: dict = {
        "event_name": event_name,
        "event_time": int(time.time()),
        "event_id": event_id,
        "event_source_url": source_url,
        "action_source": "website",
        "user_data": user_data,
        "custom_data": {
            "value": value,
            "currency": currency,
            "contents": contents,
        },
    }
    if order_id:
        event_data["custom_data"]["order_id"] = order_id

    payload: dict = {"data": [event_data]}
    if settings.META_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.META_TEST_EVENT_CODE

    url = META_CAPI_URL.format(pixel_id=settings.META_PIXEL_ID)
    params = {"access_token": settings.META_ACCESS_TOKEN}

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(url, params=params, json=payload)
        return {"status_code": resp.status_code, "body": resp.json() if resp.content else {}}
