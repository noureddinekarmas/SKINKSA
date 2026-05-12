import time

import httpx

from app.core.config import settings
from app.services.hashing import hash_geo_field, hash_phone_for_tiktok

TIKTOK_CAPI_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


def _normalize_contents_for_tiktok(contents: list[dict]) -> list[dict]:
    """Map internal {id, item_price} rows to TikTok content objects."""
    out: list[dict] = []
    for c in contents:
        cid = c.get("content_id") or c.get("id")
        if cid is None:
            continue
        row: dict = {"content_id": str(cid), "content_type": "product"}
        q = c.get("quantity")
        if q is not None:
            row["quantity"] = int(q)
        price = c.get("price") if c.get("price") is not None else c.get("item_price")
        if price is not None:
            row["price"] = float(price)
        out.append(row)
    return out


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
    geo: dict | None = None,
) -> dict:
    """
    geo dict keys (all optional): country_iso, city, subdivision, postal_code
    """
    if (
        not settings.TIKTOK_CAPI_ENABLED
        or not settings.TIKTOK_PIXEL_CODE
        or not settings.TIKTOK_ACCESS_TOKEN
    ):
        return {"skipped": True, "reason": "TIKTOK_CAPI_ENABLED=false or missing config"}

    hashed_phone = hash_phone_for_tiktok(phone_digits)

    user: dict = {"phone_number": hashed_phone}

    if geo:
        if h := hash_geo_field(geo.get("city")):
            user["city"] = h
        if h := hash_geo_field(geo.get("subdivision")):
            user["state"] = h
        if h := hash_geo_field(geo.get("postal_code")):
            user["zip_code"] = h
        if h := hash_geo_field(geo.get("country_iso")):
            user["country"] = h

    tt_contents = _normalize_contents_for_tiktok(contents)

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
            "contents": tt_contents,
        },
        "user": user,
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
