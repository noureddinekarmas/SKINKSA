import uuid
import json
from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.tracking_event import TrackingEvent
from app.models.webhook_delivery import WebhookDelivery
from app.schemas.order import FinalizeRequest
from app.services.tracking import meta_capi, tiktok_capi, snap_capi
from app.services.webhooks.sheets import send_sheets_webhook
from app.core.config import settings
from app.core.logging import logger


def _build_contents(items: list[OrderItem]) -> list[dict]:
    return [
        {
            "id": str(item.offer_id or item.upsell_offer_id or item.id),
            "quantity": item.quantity,
            "item_price": float(item.unit_price_sar),
        }
        for item in items
    ]


async def finalize_order(db: AsyncSession, order_id: str, payload: FinalizeRequest) -> dict:
    result = await db.execute(
        select(Order).where(Order.id == uuid.UUID(order_id))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.webhook_sent and order.status == "pending_confirmation":
        return {"order": order, "thank_you_token": str(order.id)}

    if payload.event_id_purchase:
        order.event_id_purchase = payload.event_id_purchase

    order.status = "pending_confirmation"

    items_result = await db.execute(select(OrderItem).where(OrderItem.order_id == order.id))
    items = list(items_result.scalars().all())

    await db.commit()
    await db.refresh(order)

    event_id = order.event_id_purchase or str(uuid.uuid4())
    value = float(order.total_sar)
    contents = _build_contents(items)
    source_url = order.source_url or f"https://officialskinksa.store"
    ip_address = order.ip_address or ""
    user_agent = order.user_agent or ""

    tracking_records: list[TrackingEvent] = []

    async def fire_and_record(platform: str, coro, event_name: str = "Purchase"):
        te = TrackingEvent(
            id=uuid.uuid4(),
            order_id=order.id,
            platform=platform,
            event_name=event_name,
            event_id=event_id,
            channel="server",
            status="pending",
        )
        try:
            result_data = await coro
            te.status = "sent" if not result_data.get("skipped") else "skipped"
            te.response_json = json.dumps(result_data)
        except Exception as exc:
            te.status = "error"
            te.error_message = str(exc)
            logger.error("CAPI error [%s]: %s", platform, exc)
        te.sent_at = datetime.now(timezone.utc)
        db.add(te)
        tracking_records.append(te)

    await fire_and_record(
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
    )

    await fire_and_record(
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
    )

    await fire_and_record(
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
    )

    webhook_delivery = WebhookDelivery(
        id=uuid.uuid4(),
        order_id=order.id,
        target="google_sheets",
        status="pending",
        attempt_count=0,
    )
    db.add(webhook_delivery)
    await db.flush()

    try:
        webhook_result = await send_sheets_webhook(db, order, items)
        if webhook_result.get("skipped"):
            webhook_delivery.status = "skipped"
        else:
            http_status = webhook_result.get("status_code") or 0
            webhook_delivery.status = (
                "delivered" if 200 <= http_status < 300 else "failed"
            )
            webhook_delivery.response_body = str(webhook_result.get("body", ""))
            webhook_delivery.payload_json = json.dumps(webhook_result.get("payload", {}))
        order.webhook_sent = True
    except Exception as exc:
        webhook_delivery.status = "failed"
        webhook_delivery.last_error = str(exc)
        logger.error("Webhook error: %s", exc)
    finally:
        import datetime as dt
        webhook_delivery.last_attempt_at = dt.datetime.now(dt.timezone.utc)
        webhook_delivery.attempt_count += 1

    await db.commit()
    refreshed = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order.id)
    )
    order = refreshed.scalar_one()

    return {"order": order, "thank_you_token": str(order.id)}
