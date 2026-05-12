from __future__ import annotations

import uuid
from datetime import date, datetime, time, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, literal, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import admin_basic_auth_required
from app.db.session import get_db
from app.models.analytics_event import AnalyticsEvent
from app.models.offer import Offer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.upsell_offer import UpsellOffer
from app.schemas.admin import (
    AdminMetricsOut,
    AdminOrderDetailOut,
    AdminOrderItemOut,
    AdminOrderListItem,
    AdminProductCountrySalesRow,
    AdminTrafficAttributionOut,
    AdminTrafficSourceRow,
)
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


def _norm_utm_source_expr(col):
    trimmed = func.trim(func.coalesce(col, ""))
    lowered = func.lower(trimmed)
    return func.coalesce(func.nullif(lowered, ""), literal("(direct)"))


def _norm_utm_medium_expr(col):
    trimmed = func.trim(func.coalesce(col, ""))
    lowered = func.lower(trimmed)
    return func.coalesce(func.nullif(lowered, ""), literal("(none)"))


@router.get("/traffic-attribution", response_model=AdminTrafficAttributionOut)
async def admin_traffic_attribution(
    db: AsyncSession = Depends(get_db),
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to"),
):
    """
    Valid KSA / non-VPN traffic only (analytics is_valid_traffic).
    Platform columns = utm_source + utm_medium (from page_view beacons).
    Orders = finalized COD with KPI-valid Saudi geo, matched to the same UTM buckets
    captured on checkout.
    """
    start, end_excl = _utc_day_range(from_date, to_date)

    ae_page_valid = and_(
        AnalyticsEvent.created_at >= start,
        AnalyticsEvent.created_at < end_excl,
        AnalyticsEvent.is_valid_traffic.is_(True),
        AnalyticsEvent.event_type == "page_view",
    )

    src_a = _norm_utm_source_expr(AnalyticsEvent.utm_source)
    med_a = _norm_utm_medium_expr(AnalyticsEvent.utm_medium)

    stmt_traffic = (
        select(
            src_a.label("utm_source"),
            med_a.label("utm_medium"),
            func.count(func.distinct(AnalyticsEvent.session_id)).label("sessions"),
            func.count().label("page_views"),
        )
        .where(
            ae_page_valid,
            AnalyticsEvent.session_id.isnot(None),
            AnalyticsEvent.session_id != "",
        )
        .group_by(src_a, med_a)
    )

    ord_date = and_(Order.created_at >= start, Order.created_at < end_excl)
    src_o = _norm_utm_source_expr(Order.utm_source)
    med_o = _norm_utm_medium_expr(Order.utm_medium)

    stmt_orders = (
        select(
            src_o.label("utm_source"),
            med_o.label("utm_medium"),
            func.count(Order.id).label("orders_kpi"),
        )
        .where(
            ord_date,
            _finalized_status_clause(),
            _valid_geo_clause(),
        )
        .group_by(src_o, med_o)
    )

    traffic_map: dict[tuple[str, str], dict[str, int]] = {}
    res_t = await db.execute(stmt_traffic)
    for row in res_t.mappings():
        key = (row["utm_source"], row["utm_medium"])
        traffic_map[key] = {
            "sessions": int(row["sessions"] or 0),
            "page_views": int(row["page_views"] or 0),
        }

    orders_map: dict[tuple[str, str], int] = {}
    res_o = await db.execute(stmt_orders)
    for row in res_o.mappings():
        key = (row["utm_source"], row["utm_medium"])
        orders_map[key] = int(row["orders_kpi"] or 0)

    all_keys = sorted(set(traffic_map) | set(orders_map), key=lambda k: (k[0], k[1]))
    rows: list[AdminTrafficSourceRow] = []
    for key in all_keys:
        t = traffic_map.get(key, {"sessions": 0, "page_views": 0})
        ocount = orders_map.get(key, 0)
        sess = t["sessions"]
        conv = round(ocount / sess, 6) if sess else 0.0
        rows.append(
            AdminTrafficSourceRow(
                utm_source=key[0],
                utm_medium=key[1],
                sessions=sess,
                page_views=t["page_views"],
                orders_kpi=ocount,
                conversion_rate=conv,
            )
        )

    r_sg = await db.execute(
        select(func.count(func.distinct(AnalyticsEvent.session_id))).where(
            ae_page_valid,
            AnalyticsEvent.session_id.isnot(None),
            AnalyticsEvent.session_id != "",
        )
    )
    total_valid_sessions = int(r_sg.scalar_one() or 0)

    r_pvg = await db.execute(select(func.count()).select_from(AnalyticsEvent).where(ae_page_valid))
    total_valid_page_views = int(r_pvg.scalar_one() or 0)

    r_og = await db.execute(
        select(func.count()).select_from(Order).where(
            ord_date,
            _finalized_status_clause(),
            _valid_geo_clause(),
        )
    )
    total_orders_kpi = int(r_og.scalar_one() or 0)

    overall_conv = (
        round(total_orders_kpi / total_valid_sessions, 6) if total_valid_sessions else 0.0
    )

    return AdminTrafficAttributionOut(
        start=start,
        end_exclusive=end_excl,
        rows=rows,
        total_valid_sessions=total_valid_sessions,
        total_valid_page_views=total_valid_page_views,
        total_orders_kpi=total_orders_kpi,
        overall_conversion_rate=overall_conv,
    )


@router.get("/sales-by-product", response_model=list[AdminProductCountrySalesRow])
async def admin_sales_by_product(
    db: AsyncSession = Depends(get_db),
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to"),
    finalized_only: bool = Query(
        True,
        description="When true, only orders with status pending_confirmation (COD completed).",
    ),
):
    start, end_excl = _utc_day_range(from_date, to_date)

    display_sku = func.coalesce(UpsellOffer.sku, Product.sku)
    product_ref = func.coalesce(OrderItem.product_id, Offer.product_id, UpsellOffer.product_id)

    stmt = (
        select(
            Product.id.label("product_id"),
            Product.slug.label("product_slug"),
            Product.title_ar.label("product_title_ar"),
            display_sku.label("product_sku"),
            OrderItem.is_upsell.label("is_upsell"),
            Order.geo_country.label("geo_country"),
            func.count(func.distinct(Order.id)).label("order_count"),
            func.sum(OrderItem.quantity).label("units_sold"),
            func.sum(OrderItem.line_total_sar).label("revenue_sar"),
        )
        .select_from(Order)
        .join(OrderItem, OrderItem.order_id == Order.id)
        .outerjoin(Offer, Offer.id == OrderItem.offer_id)
        .outerjoin(UpsellOffer, UpsellOffer.id == OrderItem.upsell_offer_id)
        .join(Product, Product.id == product_ref)
        .where(
            Order.created_at >= start,
            Order.created_at < end_excl,
        )
        .group_by(
            Product.id,
            Product.slug,
            Product.title_ar,
            display_sku,
            OrderItem.is_upsell,
            Order.geo_country,
        )
        .order_by(Product.slug.asc(), Order.geo_country.asc().nulls_first(), OrderItem.is_upsell.asc())
    )

    if finalized_only:
        stmt = stmt.where(_finalized_status_clause())

    result = await db.execute(stmt)
    rows = result.mappings().all()
    return [
        AdminProductCountrySalesRow(
            product_id=r["product_id"],
            product_slug=r["product_slug"],
            product_sku=r["product_sku"],
            product_title_ar=r["product_title_ar"],
            line_type="upsell" if r["is_upsell"] else "primary",
            geo_country=r["geo_country"],
            order_count=int(r["order_count"] or 0),
            units_sold=int(r["units_sold"] or 0),
            revenue_sar=r["revenue_sar"],
        )
        for r in rows
    ]


async def _enrich_order_items(db: AsyncSession, items: list[OrderItem]) -> list[AdminOrderItemOut]:
    if not items:
        return []
    offer_ids = {i.offer_id for i in items if i.offer_id}
    uo_ids = {i.upsell_offer_id for i in items if i.upsell_offer_id}
    offer_map: dict[uuid.UUID, Offer] = {}
    if offer_ids:
        res = await db.execute(select(Offer).where(Offer.id.in_(offer_ids)))
        offer_map = {o.id: o for o in res.scalars()}
    uo_map: dict[uuid.UUID, UpsellOffer] = {}
    if uo_ids:
        res = await db.execute(select(UpsellOffer).where(UpsellOffer.id.in_(uo_ids)))
        uo_map = {u.id: u for u in res.scalars()}

    product_ids: set[uuid.UUID] = set()
    for it in items:
        pid = it.product_id
        if not pid and it.offer_id and it.offer_id in offer_map:
            pid = offer_map[it.offer_id].product_id
        if not pid and it.upsell_offer_id and it.upsell_offer_id in uo_map:
            pid = uo_map[it.upsell_offer_id].product_id
        if pid:
            product_ids.add(pid)

    prod_map: dict[uuid.UUID, Product] = {}
    if product_ids:
        res = await db.execute(select(Product).where(Product.id.in_(product_ids)))
        prod_map = {p.id: p for p in res.scalars()}

    out: list[AdminOrderItemOut] = []
    for it in items:
        slug_out: str | None = None
        sku_out: str | None = None
        pid = it.product_id
        if not pid and it.offer_id and it.offer_id in offer_map:
            pid = offer_map[it.offer_id].product_id
        if not pid and it.upsell_offer_id and it.upsell_offer_id in uo_map:
            pid = uo_map[it.upsell_offer_id].product_id
        if pid and pid in prod_map:
            pr = prod_map[pid]
            slug_out = pr.slug
            sku_out = pr.sku
        if it.is_upsell and it.upsell_offer_id and it.upsell_offer_id in uo_map:
            uo = uo_map[it.upsell_offer_id]
            if uo.sku:
                sku_out = uo.sku
        out.append(
            AdminOrderItemOut(
                id=it.id,
                title_snapshot=it.title_snapshot,
                quantity=it.quantity,
                unit_price_sar=it.unit_price_sar,
                line_total_sar=it.line_total_sar,
                is_upsell=it.is_upsell,
                product_slug=slug_out,
                sku=sku_out,
            )
        )
    return out


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

    enriched = await _enrich_order_items(db, list(o.items))

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
        items=enriched,
        webhook_deliveries=list(o.webhook_deliveries),
        counts_as_valid_kpi=counts,
    )
