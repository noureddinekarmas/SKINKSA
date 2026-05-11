import uuid
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy import func as sql_func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.logging import logger
from app.models.offer import Offer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import DraftOrderRequest
from app.services.geoip import GeoData, check_ip
from app.services.phone import is_valid_saudi_mobile, normalize_saudi_mobile


async def _next_order_number(db: AsyncSession) -> str:
    result = await db.execute(select(sql_func.max(Order.order_number)))
    max_number = result.scalar_one_or_none()

    if max_number is None:
        next_num = settings.ORDER_NUMBER_START
    else:
        prefix = settings.ORDER_NUMBER_PREFIX + "-"
        try:
            current_num = int(max_number.replace(prefix, ""))
            next_num = current_num + 1
        except (ValueError, AttributeError):
            next_num = settings.ORDER_NUMBER_START

    return f"{settings.ORDER_NUMBER_PREFIX}-{next_num}"


async def create_draft_order(
    db: AsyncSession,
    payload: DraftOrderRequest,
    *,
    skip_geoip: bool = False,
) -> Order:
    # ── Phone validation ──────────────────────────────────────────────────────
    if not is_valid_saudi_mobile(payload.customer_phone):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid Saudi mobile number",
        )
    phone_data = normalize_saudi_mobile(payload.customer_phone)

    if not payload.cart_items:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Cart must contain at least one item",
        )

    # ── MaxMind GeoIP check ───────────────────────────────────────────────────
    attribution = payload.attribution
    ip_address = attribution.ip_address if attribution else None

    if skip_geoip:
        geo = GeoData(source="whitelist_bypass")
    else:
        geo_result = await check_ip(ip_address)

        if not geo_result.allowed:
            logger.warning(
                "Order blocked by GeoIP: ip=%s reason=%s", ip_address, geo_result.reason
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Order not accepted from this location.",
            )

        geo = geo_result.geo

    # ── Offer lookup ──────────────────────────────────────────────────────────
    primary_item = payload.cart_items[0]
    offer_result = await db.execute(
        select(Offer).where(Offer.code == primary_item.offer_code, Offer.active.is_(True))
    )
    offer = offer_result.scalar_one_or_none()

    order_number = await _next_order_number(db)
    event_ids = payload.event_ids
    subtotal = sum(item.unit_price_sar * item.quantity for item in payload.cart_items)

    order = Order(
        id=uuid.uuid4(),
        order_number=order_number,
        status="draft",
        customer_name=payload.customer_name,
        customer_phone_raw=payload.customer_phone,
        customer_phone_e164=phone_data["e164"],
        customer_phone_digits=phone_data["digits"],
        customer_address=payload.customer_address,
        customer_province=payload.customer_province,
        currency=settings.DEFAULT_CURRENCY,
        subtotal_sar=subtotal,
        upsell_sar=Decimal("0"),
        total_sar=subtotal,
        selected_offer_code=primary_item.offer_code,
        source_url=attribution.source_url if attribution else None,
        utm_source=attribution.utm_source if attribution else None,
        utm_medium=attribution.utm_medium if attribution else None,
        utm_campaign=attribution.utm_campaign if attribution else None,
        utm_content=attribution.utm_content if attribution else None,
        utm_term=attribution.utm_term if attribution else None,
        fbclid=attribution.fbclid if attribution else None,
        ttclid=attribution.ttclid if attribution else None,
        snap_click_id=attribution.snap_click_id if attribution else None,
        user_agent=attribution.user_agent if attribution else None,
        ip_address=ip_address,
        event_id_initiate_checkout=event_ids.initiate_checkout if event_ids else None,
        # MaxMind geo enrichment
        geo_country=geo.country_iso,
        geo_city=geo.city,
        geo_subdivision=geo.subdivision,
        geo_postal_code=geo.postal_code,
        geo_latitude=geo.latitude,
        geo_longitude=geo.longitude,
        geo_is_vpn=geo.is_vpn,
        geo_is_proxy=geo.is_proxy,
        geo_risk_score=geo.risk_score,
        geo_source=geo.source,
    )
    db.add(order)
    await db.flush()

    for cart_item in payload.cart_items:
        same_offer = offer and cart_item.offer_code == primary_item.offer_code
        item_offer_id = offer.id if same_offer else None
        order_item = OrderItem(
            id=uuid.uuid4(),
            order_id=order.id,
            offer_id=item_offer_id,
            title_snapshot=cart_item.title_snapshot,
            quantity=cart_item.quantity,
            unit_price_sar=cart_item.unit_price_sar,
            line_total_sar=cart_item.unit_price_sar * cart_item.quantity,
            is_upsell=False,
        )
        db.add(order_item)

    await db.commit()
    refreshed = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order.id)
    )
    return refreshed.scalar_one()
