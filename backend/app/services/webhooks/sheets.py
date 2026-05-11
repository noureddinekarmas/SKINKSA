import httpx
from app.core.config import settings


async def send_sheets_webhook(order, items, tracking_events) -> dict:
    if not settings.ORDERS_WEBHOOK_URL or not settings.ORDERS_WEBHOOK_TOKEN:
        return {"skipped": True, "reason": "Webhook URL/token not configured"}

    payload = {
        "token": settings.ORDERS_WEBHOOK_TOKEN,
        "order": {
            "id": str(order.id),
            "order_number": order.order_number,
            "status": order.status,
            "customer_name": order.customer_name,
            "customer_phone_e164": order.customer_phone_e164,
            "customer_phone_digits": order.customer_phone_digits,
            "customer_address": order.customer_address,
            "customer_province": order.customer_province,
            "currency": order.currency,
            "subtotal_sar": float(order.subtotal_sar),
            "upsell_sar": float(order.upsell_sar),
            "total_sar": float(order.total_sar),
            "selected_offer_code": order.selected_offer_code,
            "upsell_decision": order.upsell_decision,
        },
        "items": [
            {
                "id": str(item.id),
                "product_slug": "blue-copper-peptide-serum",
                "product_title": item.title_snapshot,
                "offer_code": order.selected_offer_code if not item.is_upsell else "UPSELL",
                "quantity": item.quantity,
                "unit_price_sar": float(item.unit_price_sar),
                "line_total_sar": float(item.line_total_sar),
                "is_upsell": item.is_upsell,
            }
            for item in items
        ],
        "attribution": {
            "source_url": order.source_url,
            "utm_source": order.utm_source,
            "utm_medium": order.utm_medium,
            "utm_campaign": order.utm_campaign,
            "utm_content": order.utm_content,
            "utm_term": order.utm_term,
            "fbclid": order.fbclid,
            "ttclid": order.ttclid,
            "snap_click_id": order.snap_click_id,
            "user_agent": order.user_agent,
            "ip_address": order.ip_address,
        },
        "tracking": [
            {
                "platform": evt.platform,
                "event_name": evt.event_name,
                "event_id": evt.event_id,
                "channel": evt.channel,
                "status": evt.status,
                "value_sar": None,
                "currency": "SAR",
                "response_code": None,
                "error_message": evt.error_message,
            }
            for evt in tracking_events
        ],
    }

    async with httpx.AsyncClient(timeout=settings.ORDERS_WEBHOOK_TIMEOUT_SECONDS) as client:
        resp = await client.post(settings.ORDERS_WEBHOOK_URL, json=payload)
        return {
            "status_code": resp.status_code,
            "body": resp.text,
            "payload": payload,
        }
