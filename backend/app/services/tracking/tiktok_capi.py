import time

import httpx

from app.core.config import settings
from app.services.hashing import hash_phone_for_tiktok

TIKTOK_CAPI_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


async def send_tiktok_capi_event(
    event_name: str,
    event_id: str,
    value: float,
    currency: str,
    phone_digits: str,
    source_url: str,
    ip_address: str,
    user_agent: str,
    ttclid: str | None,
    contents: list[dict],
    order_id: str | None = None,
) -> dict:
    if (
        not settings.TIKTOK_CAPI_ENABLED
        or not settings.TIKTOK_PIXEL_CODE
        or not settings.TIKTOK_ACCESS_TOKEN
    ):
        return {"skipped": True, "reason": "TIKTOK_CAPI_ENABLED=false or missing config"}

    hashed_phone = hash_phone_for_tiktok(phone_digits)

    event_data: dict = {
        "event": event_name,
        "event_id": event_id,
        "timestamp": str(int(time.time())),
        "context": {
            "user_agent": user_agent,
            "ip": ip_address,
            "page": {"url": source_url},
        },
        "properties": {
            "value": value,
            "currency": currency,
            "contents": contents,
        },
        "user": {
            "phone_number": hashed_phone,
        },
    }
    if ttclid:
        event_data["context"]["ad"] = {"callback": ttclid}

    payload: dict = {
        "pixel_code": settings.TIKTOK_PIXEL_CODE,
        "batch": [event_data],
    }
    if settings.TIKTOK_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.TIKTOK_TEST_EVENT_CODE

    headers = {
        "Access-Token": settings.TIKTOK_ACCESS_TOKEN,
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(TIKTOK_CAPI_URL, headers=headers, json=payload)
        return {"status_code": resp.status_code, "body": resp.json() if resp.content else {}}
