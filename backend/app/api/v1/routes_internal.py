import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.core.security import internal_api_key_required
from app.db.session import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.tracking_event import TrackingEvent
from app.models.webhook_delivery import WebhookDelivery
from app.services.tracking import meta_capi, snap_capi, tiktok_capi
from app.services.webhooks.sheets import send_sheets_webhook

router = APIRouter(
    prefix="/internal",
    tags=["internal"],
    dependencies=[Depends(internal_api_key_required)],
)


async def _load_order(db: AsyncSession, order_id: str) -> Order:
    try:
        oid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    result = await db.execute(select(Order).where(Order.id == oid))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.post("/orders/{order_id}/resend-webhook")
async def resend_webhook(order_id: str, db: AsyncSession = Depends(get_db)):
    order = await _load_order(db, order_id)

    items_result = await db.execute(select(OrderItem).where(OrderItem.order_id == order.id))
    items = list(items_result.scalars().all())

    events_result = await db.execute(
        select(TrackingEvent).where(TrackingEvent.order_id == order.id)
    )
    tracking_events = list(events_result.scalars().all())

    delivery = WebhookDelivery(
        id=uuid.uuid4(),
        order_id=order.id,
        target="google_sheets",
        status="pending",
        attempt_count=0,
    )
    db.add(delivery)
    await db.flush()

    try:
        result_data = await send_sheets_webhook(order, items, tracking_events)
        delivery.status = "delivered" if not result_data.get("skipped") else "skipped"
        delivery.response_body = result_data.get("body", "")
        delivery.payload_json = json.dumps(result_data.get("payload", {}))
    except Exception as exc:
        delivery.status = "failed"
        delivery.last_error = str(exc)
        logger.error("Resend webhook error: %s", exc)
    finally:
        delivery.last_attempt_at = datetime.now(timezone.utc)
        delivery.attempt_count += 1

    await db.commit()
    return {"ok": True, "status": delivery.status}


@router.post("/orders/{order_id}/replay-tracking")
async def replay_tracking(order_id: str, db: AsyncSession = Depends(get_db)):
    order = await _load_order(db, order_id)

    items_result = await db.execute(select(OrderItem).where(OrderItem.order_id == order.id))
    items = list(items_result.scalars().all())

    event_id = order.event_id_purchase or str(uuid.uuid4())
    value = float(order.total_sar)
    source_url = order.source_url or "https://officialskinksa.store"
    ip_address = order.ip_address or ""
    user_agent = order.user_agent or ""
    contents = [
        {
            "id": str(item.offer_id or item.upsell_offer_id or item.id),
            "quantity": item.quantity,
            "item_price": float(item.unit_price_sar),
        }
        for item in items
    ]

    results = {}

    for platform, coro in [
        (
            "meta",
            meta_capi.send_meta_capi_event(
                event_name="Purchase",
                event_id=event_id,
                value=value,
                currency=settings.DEFAULT_CURRENCY,
                phone_digits=order.customer_phone_digits,
                source_url=source_url,
                ip_address=ip_address,
                user_agent=user_agent,
                fbclid=order.fbclid,
                contents=contents,
                order_id=str(order.id),
            ),
        ),
        (
            "tiktok",
            tiktok_capi.send_tiktok_capi_event(
                event_name="Purchase",
                event_id=event_id,
                value=value,
                currency=settings.DEFAULT_CURRENCY,
                phone_digits=order.customer_phone_digits,
                source_url=source_url,
                ip_address=ip_address,
                user_agent=user_agent,
                ttclid=order.ttclid,
                contents=contents,
                order_id=str(order.id),
            ),
        ),
        (
            "snap",
            snap_capi.send_snap_capi_event(
                event_name="PURCHASE",
                event_id=event_id,
                value=value,
                currency=settings.DEFAULT_CURRENCY,
                phone_digits=order.customer_phone_digits,
                source_url=source_url,
                ip_address=ip_address,
                user_agent=user_agent,
                snap_click_id=order.snap_click_id,
                order_id=str(order.id),
            ),
        ),
    ]:
        try:
            results[platform] = await coro
        except Exception as exc:
            results[platform] = {"error": str(exc)}
            logger.error("Replay tracking [%s]: %s", platform, exc)

    return {"ok": True, "results": results}
