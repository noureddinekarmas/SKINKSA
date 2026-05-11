"""Google Sheets webhook: one row per order, columns match NETWORK ORDERS sheet (Sheet1)."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.offer import Offer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.upsell_offer import UpsellOffer

# Must match row 1 of the sheet (see user template CSV).
NETWORK_ORDERS_COLUMN_ORDER = [
    "OrderDate",
    "country",
    "name",
    "phone",
    "address",
    "url",
    "sku",
    "Product",
    "quantity",
    "price",
    "currency",
    "notes",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "national_address",
]

_KSA_TZ = ZoneInfo("Asia/Riyadh")


def _format_order_date(created_at: datetime | None) -> str:
    """DD/MM/YYYY in Asia/Riyadh."""
    dt = created_at or datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    local = dt.astimezone(_KSA_TZ)
    return local.strftime("%d/%m/%Y")


def _fallback_sku(seed: str) -> str:
    h = hashlib.sha256(seed.encode("utf-8")).hexdigest()[:10].upper()
    return f"NAMA-{h}"


def _external_order_ref(order: Order) -> str:
    """Human-readable id starting with nama (stored in notes; no separate column in sheet)."""
    base = order.order_number.replace(" ", "").lower()
    return f"nama-{base}"


def _sheet_phone(order: Order) -> str:
    """Digits only 966XXXXXXXXX."""
    d = (order.customer_phone_digits or "").strip()
    if not d:
        return "-"
    if d.startswith("966"):
        return d
    if d.startswith("5") and len(d) == 9:
        return f"966{d}"
    return d


def _sheet_address(order: Order) -> str:
    province = (order.customer_province or "").strip()
    addr = (order.customer_address or "").strip()
    if province and addr:
        return f"{province} — {addr}"
    if addr:
        return addr
    if province:
        return province
    return "-"


def _national_address(order: Order) -> str:
    parts = [p for p in (order.customer_province, order.geo_postal_code) if p]
    if parts:
        return " ".join(parts)
    return "-"


def _sort_items(items: list[OrderItem]) -> list[OrderItem]:
    def key(i: OrderItem) -> tuple:
        ca = i.created_at
        if ca is None:
            ca = datetime.min.replace(tzinfo=timezone.utc)
        elif ca.tzinfo is None:
            ca = ca.replace(tzinfo=timezone.utc)
        return (i.is_upsell, ca)

    return sorted(items, key=key)


async def _resolve_lines(
    db: AsyncSession,
    items: list[OrderItem],
) -> tuple[list[str], list[str], list[int]]:
    """Parallel lists: Arabic titles, SKUs, quantities (one segment per order line)."""
    items = _sort_items(items)
    offer_ids = [i.offer_id for i in items if i.offer_id]
    upsell_ids = [i.upsell_offer_id for i in items if i.upsell_offer_id]

    offers_by_id: dict = {}
    if offer_ids:
        r = await db.execute(select(Offer).where(Offer.id.in_(offer_ids)))
        offers_by_id = {o.id: o for o in r.scalars().all()}

    upsells_by_id: dict = {}
    if upsell_ids:
        r = await db.execute(select(UpsellOffer).where(UpsellOffer.id.in_(upsell_ids)))
        upsells_by_id = {u.id: u for u in r.scalars().all()}

    product_ids: set = set()
    for it in items:
        if it.offer_id and it.offer_id in offers_by_id:
            product_ids.add(offers_by_id[it.offer_id].product_id)
        if it.upsell_offer_id and it.upsell_offer_id in upsells_by_id:
            product_ids.add(upsells_by_id[it.upsell_offer_id].product_id)

    products_by_id: dict = {}
    if product_ids:
        r = await db.execute(select(Product).where(Product.id.in_(product_ids)))
        products_by_id = {p.id: p for p in r.scalars().all()}

    titles: list[str] = []
    skus: list[str] = []
    quantities: list[int] = []

    for it in items:
        if it.upsell_offer_id and it.upsell_offer_id in upsells_by_id:
            u = upsells_by_id[it.upsell_offer_id]
            titles.append((u.title_ar or "").strip() or it.title_snapshot)
            usku = (u.sku or "").strip() or None
            skus.append(usku or _fallback_sku(f"upsell:{u.id}"))
        elif it.offer_id and it.offer_id in offers_by_id:
            o = offers_by_id[it.offer_id]
            pid = o.product_id
            if pid in products_by_id:
                p = products_by_id[pid]
                titles.append(p.title_ar)
                skus.append(p.sku or _fallback_sku(f"{p.slug}:{p.id}"))
            else:
                titles.append(it.title_snapshot)
                skus.append(_fallback_sku(f"{it.id}:{it.title_snapshot}"))
        else:
            titles.append(it.title_snapshot)
            skus.append(_fallback_sku(f"{it.id}:{it.title_snapshot}"))

        quantities.append(it.quantity)

    return titles, skus, quantities


def _slash_join(values: list[str | int]) -> str:
    return "/".join(str(v) for v in values)


async def send_sheets_webhook(
    db: AsyncSession,
    order: Order,
    items: list[OrderItem],
) -> dict:
    if not settings.ORDERS_WEBHOOK_URL:
        return {"skipped": True, "reason": "ORDERS_WEBHOOK_URL not configured"}

    titles_ar, skus, quantities = await _resolve_lines(db, items)

    def non_empty_slash(values: list[str] | list[int], empty: str = "-") -> str:
        s = _slash_join(values)
        return s if s else empty

    ext_ref = _external_order_ref(order)
    price_total = float(order.total_sar)

    row_values = {
        "OrderDate": _format_order_date(order.created_at),
        "country": "KSA",
        "name": order.customer_name,
        "phone": _sheet_phone(order),
        "address": _sheet_address(order),
        "url": order.source_url or "https://officialskinksa.store",
        "sku": non_empty_slash(skus),
        "Product": non_empty_slash(titles_ar),
        "quantity": non_empty_slash(quantities),
        "price": price_total,
        "currency": "SAR",
        "notes": f"{ext_ref} | #{order.order_number} | {order.id}",
        "utm_source": order.utm_source or "",
        "utm_medium": order.utm_medium or "",
        "utm_campaign": order.utm_campaign or "",
        "utm_term": order.utm_term or "",
        "utm_content": order.utm_content or "",
        "national_address": _national_address(order),
    }

    row_ordered = [row_values[col] for col in NETWORK_ORDERS_COLUMN_ORDER]

    payload = {
        "column_order": NETWORK_ORDERS_COLUMN_ORDER,
        "sheet_row": row_values,
        "row": row_ordered,
    }

    async with httpx.AsyncClient(timeout=settings.ORDERS_WEBHOOK_TIMEOUT_SECONDS) as client:
        resp = await client.post(
            settings.ORDERS_WEBHOOK_URL,
            json=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
        )
        return {
            "status_code": resp.status_code,
            "body": resp.text,
            "payload": payload,
        }
