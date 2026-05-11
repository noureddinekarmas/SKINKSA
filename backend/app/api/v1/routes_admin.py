from __future__ import annotations

import uuid
from datetime import date, datetime, time, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import admin_basic_auth_required
from app.db.session import get_db
from app.models.analytics_event import AnalyticsEvent
from app.models.order import Order
from app.schemas.admin import AdminMetricsOut, AdminOrderDetailOut, AdminOrderListItem
from app.services.traffic_validity import order_geo_valid_for_kpi

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(admin_basic_auth_required)],
)


def _utc_day_range(from_day: date, to_day: date) -> tuple[datetime, datetime]:
    if to_day < from_day:
        raise HTTPException(status_code=422, detail="to must be >= from")
    start = datetime.combine(from_day, time.min, tzinfo=timezone.utc)
    end_excl = datetime.combine(to_day + timedelta(days=1), time.min, tzinfo=timezone.utc)
    return start, end_excl


def _finalized_status_clause():
    return Order.status == "pending_confirmation"


def _valid_geo_clause():
    return and_(
        func.upper(func.coalesce(Order.geo_country, "")) == "SA",
        Order.geo_is_vpn.is_(False),
        Order.geo_is_proxy.is_(False),
        Order.geo_is_tor.is_(False),
        Order.geo_secondary_vpn.is_(False),
    )


@router.get("/metrics", response_model=AdminMetricsOut)
async def admin_metrics(
    db: AsyncSession = Depends(get_db),
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to"),
):
    start, end_excl = _utc_day_range(from_date, to_date)

    base_ae = and_(
        AnalyticsEvent.created_at >= start,
        AnalyticsEvent.created_at < end_excl,
        AnalyticsEvent.is_valid_traffic.is_(True),
    )

    async def _count_event(etype: str) -> int:
        r = await db.execute(select(func.count()).select_from(AnalyticsEvent).where(base_ae, AnalyticsEvent.event_type == etype))
        return int(r.scalar_one() or 0)

    valid_page_views = await _count_event("page_view")
    valid_product_views = await _count_event("product_view")
    valid_add_to_cart = await _count_event("add_to_cart")
    valid_begin_checkout = await _count_event("begin_checkout")

    r_all = await db.execute(
        select(func.count()).select_from(AnalyticsEvent).where(
            AnalyticsEvent.created_at >= start,
            AnalyticsEvent.created_at < end_excl,
            AnalyticsEvent.is_valid_traffic.is_(True),
        )
    )
    valid_events_total = int(r_all.scalar_one() or 0)

    r_sess = await db.execute(
        select(func.count(func.distinct(AnalyticsEvent.session_id)))
        .select_from(AnalyticsEvent)
        .where(
            base_ae,
            AnalyticsEvent.session_id.isnot(None),
            AnalyticsEvent.session_id != "",
        )
    )
    valid_sessions = int(r_sess.scalar_one() or 0)

    finalized = and_(
        Order.created_at >= start,
        Order.created_at < end_excl,
        _finalized_status_clause(),
    )

    r_ord_all = await db.execute(select(func.count()).select_from(Order).where(finalized))
    finalized_orders_all = int(r_ord_all.scalar_one() or 0)

    r_ord_valid = await db.execute(
        select(func.count()).select_from(Order).where(finalized, _valid_geo_clause())
    )
    finalized_orders_valid_geo = int(r_ord_valid.scalar_one() or 0)

    rev_all = await db.execute(
        select(func.coalesce(func.sum(Order.total_sar), 0)).where(finalized)
    )
    revenue_all_sar = rev_all.scalar_one()

    rev_valid = await db.execute(
        select(func.coalesce(func.sum(Order.total_sar), 0)).where(finalized, _valid_geo_clause())
    )
    revenue_valid_sar = rev_valid.scalar_one()

    conv_sess = (
        finalized_orders_valid_geo / valid_sessions
        if valid_sessions
        else 0.0
    )
    conv_pv = (
        finalized_orders_valid_geo / valid_product_views
        if valid_product_views
        else 0.0
    )

    return AdminMetricsOut(
        start=start,
        end_exclusive=end_excl,
        valid_page_views=valid_page_views,
        valid_product_views=valid_product_views,
        valid_add_to_cart=valid_add_to_cart,
        valid_begin_checkout=valid_begin_checkout,
        valid_events_total=valid_events_total,
        valid_sessions=valid_sessions,
        finalized_orders_valid_geo=finalized_orders_valid_geo,
        finalized_orders_all=finalized_orders_all,
        revenue_valid_sar=revenue_valid_sar,
        revenue_all_sar=revenue_all_sar,
        conversion_valid_sessions_to_order=round(conv_sess, 6),
        conversion_valid_product_views_to_order=round(conv_pv, 6),
    )


@router.get("/orders", response_model=list[AdminOrderListItem])
async def admin_list_orders(
    db: AsyncSession = Depends(get_db),
    from_date: date | None = Query(None, alias="from"),
    to_date: date | None = Query(None, alias="to"),
    status_filter: str | None = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    stmt = select(Order).order_by(Order.created_at.desc())
    if from_date and to_date:
        start, end_excl = _utc_day_range(from_date, to_date)
        stmt = stmt.where(Order.created_at >= start, Order.created_at < end_excl)
    elif from_date or to_date:
        raise HTTPException(status_code=422, detail="Provide both from and to, or neither")

    if status_filter:
        stmt = stmt.where(Order.status == status_filter)

    stmt = stmt.offset(offset).limit(limit)
    result = await db.execute(stmt)
    rows = list(result.scalars().all())
    out: list[AdminOrderListItem] = []
    for o in rows:
        counts = order_geo_valid_for_kpi(
            o.geo_country,
            o.geo_is_vpn,
            o.geo_is_proxy,
            o.geo_is_tor,
            o.geo_secondary_vpn,
        ) and o.status == "pending_confirmation"
        out.append(
            AdminOrderListItem(
                id=o.id,
                order_number=o.order_number,
                status=o.status,
                created_at=o.created_at,
                total_sar=o.total_sar,
                customer_name=o.customer_name,
                customer_phone_e164=o.customer_phone_e164,
                customer_province=o.customer_province,
                geo_country=o.geo_country,
                geo_is_vpn=o.geo_is_vpn,
                geo_is_proxy=o.geo_is_proxy,
                geo_is_tor=o.geo_is_tor,
                geo_secondary_vpn=o.geo_secondary_vpn,
                counts_as_valid_kpi=counts,
                utm_source=o.utm_source,
                utm_campaign=o.utm_campaign,
            )
        )
    return out


@router.get("/orders/{order_id}", response_model=AdminOrderDetailOut)
async def admin_order_detail(order_id: str, db: AsyncSession = Depends(get_db)):
    try:
        oid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Order not found")
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items), selectinload(Order.webhook_deliveries))
        .where(Order.id == oid)
    )
    o = result.scalar_one_or_none()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")

    counts = order_geo_valid_for_kpi(
        o.geo_country,
        o.geo_is_vpn,
        o.geo_is_proxy,
        o.geo_is_tor,
        o.geo_secondary_vpn,
    ) and o.status == "pending_confirmation"

    return AdminOrderDetailOut(
        id=o.id,
        order_number=o.order_number,
        status=o.status,
        created_at=o.created_at,
        updated_at=o.updated_at,
        customer_name=o.customer_name,
        customer_phone_raw=o.customer_phone_raw,
        customer_phone_e164=o.customer_phone_e164,
        customer_address=o.customer_address,
        customer_province=o.customer_province,
        currency=o.currency,
        subtotal_sar=o.subtotal_sar,
        upsell_sar=o.upsell_sar,
        total_sar=o.total_sar,
        selected_offer_code=o.selected_offer_code,
        upsell_decision=o.upsell_decision,
        source_url=o.source_url,
        utm_source=o.utm_source,
        utm_medium=o.utm_medium,
        utm_campaign=o.utm_campaign,
        utm_content=o.utm_content,
        utm_term=o.utm_term,
        user_agent=o.user_agent,
        ip_address=o.ip_address,
        geo_country=o.geo_country,
        geo_city=o.geo_city,
        geo_subdivision=o.geo_subdivision,
        geo_postal_code=o.geo_postal_code,
        geo_is_vpn=o.geo_is_vpn,
        geo_is_proxy=o.geo_is_proxy,
        geo_is_tor=o.geo_is_tor,
        geo_secondary_vpn=o.geo_secondary_vpn,
        geo_risk_score=o.geo_risk_score,
        geo_source=o.geo_source,
        webhook_sent=o.webhook_sent,
        items=list(o.items),
        webhook_deliveries=list(o.webhook_deliveries),
        counts_as_valid_kpi=counts,
    )
