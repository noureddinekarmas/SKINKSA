from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class AdminProductCountrySalesRow(BaseModel):
    """Aggregated finalized-order lines by catalog product, country, and line kind."""

    product_id: UUID
    product_slug: str
    product_sku: Optional[str] = None
    product_title_ar: str
    line_type: str  # primary | upsell
    geo_country: Optional[str] = None
    order_count: int
    units_sold: int
    revenue_sar: Decimal


class AdminTrafficSourceRow(BaseModel):
    """Sessions / page views grouped by UTM, plus finalized orders and conversion."""

    ad_platform: str  # inferred: TikTok Ads, Snapchat Ads, Meta, etc.
    utm_source: str  # normalized; "(direct)" when missing
    utm_medium: str  # normalized; "(none)" when missing
    sessions: int
    page_views: int
    orders_kpi: int
    conversion_rate: float


class AdminProductPageStatsRow(BaseModel):
    """Per product PDP (/products/{slug}): funnel + finalized orders containing that product."""

    product_slug: str
    page_path: str
    product_title_ar: Optional[str] = None
    product_sku: Optional[str] = None
    sessions: int
    product_views: int
    add_to_cart: int
    begin_checkout: int
    orders_kpi: int
    conversion_rate: float


class AdminTrafficAttributionOut(BaseModel):
    start: datetime
    end_exclusive: datetime
    rows: list[AdminTrafficSourceRow]
    total_valid_sessions: int
    total_valid_page_views: int
    total_orders_kpi: int
    overall_conversion_rate: float


class AdminMetricsOut(BaseModel):
    start: datetime
    end_exclusive: datetime
    # Saudi + non-VPN only (dashboard KPI definition)
    valid_page_views: int
    valid_product_views: int
    valid_add_to_cart: int
    valid_begin_checkout: int
    valid_events_total: int
    valid_sessions: int
    # Everyone who hit the beacon (before Saudi/VPN filter) — use to compare vs ads
    all_page_views: int
    all_product_views: int
    all_add_to_cart: int
    all_begin_checkout: int
    all_events_total: int
    all_sessions: int
    finalized_orders_valid_geo: int
    finalized_orders_all: int
    revenue_valid_sar: Decimal
    revenue_all_sar: Decimal
    conversion_valid_sessions_to_order: float
    conversion_valid_product_views_to_order: float


class AdminAnalyticsStreamRow(BaseModel):
    """Recent storefront beacons (debug funnel vs ad platforms)."""

    id: UUID
    created_at: datetime
    event_type: str
    path: Optional[str] = None
    product_slug: Optional[str] = None
    session_short: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    geo_country: Optional[str] = None
    is_valid_traffic: bool
    geo_is_vpn: bool
    geo_is_proxy: bool
    geo_is_tor: bool
    secondary_vpn_detected: bool
    ip_masked: Optional[str] = None


class AdminOrderListItem(BaseModel):
    id: UUID
    order_number: str
    status: str
    created_at: datetime
    total_sar: Decimal
    customer_name: str
    customer_phone_e164: str
    customer_province: Optional[str] = None
    geo_country: Optional[str] = None
    geo_is_vpn: bool
    geo_is_proxy: bool
    geo_is_tor: bool = False
    geo_secondary_vpn: bool = False
    counts_as_valid_kpi: bool
    utm_source: Optional[str] = None
    utm_campaign: Optional[str] = None

    model_config = {"from_attributes": False}


class AdminOrderItemOut(BaseModel):
    id: UUID
    title_snapshot: str
    quantity: int
    unit_price_sar: Decimal
    line_total_sar: Decimal
    is_upsell: bool
    product_slug: Optional[str] = None
    sku: Optional[str] = None

    model_config = {"from_attributes": True}


class AdminWebhookDeliveryOut(BaseModel):
    id: UUID
    target: str
    status: str
    attempt_count: int
    last_error: Optional[str] = None
    last_attempt_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminOrderDetailOut(BaseModel):
    id: UUID
    order_number: str
    status: str
    created_at: datetime
    updated_at: datetime
    customer_name: str
    customer_phone_raw: str
    customer_phone_e164: str
    customer_address: Optional[str] = None
    customer_province: Optional[str] = None
    currency: str
    subtotal_sar: Decimal
    upsell_sar: Decimal
    total_sar: Decimal
    selected_offer_code: Optional[str] = None
    upsell_decision: Optional[str] = None
    source_url: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    geo_country: Optional[str] = None
    geo_city: Optional[str] = None
    geo_subdivision: Optional[str] = None
    geo_postal_code: Optional[str] = None
    geo_is_vpn: bool
    geo_is_proxy: bool
    geo_is_tor: bool = False
    geo_secondary_vpn: bool = False
    geo_risk_score: Optional[float] = None
    geo_source: Optional[str] = None
    webhook_sent: bool
    items: list[AdminOrderItemOut]
    webhook_deliveries: list[AdminWebhookDeliveryOut]
    counts_as_valid_kpi: bool
