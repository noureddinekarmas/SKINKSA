from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.order_item import OrderItem
    from app.models.tracking_event import TrackingEvent
    from app.models.webhook_delivery import WebhookDelivery


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    customer_name: Mapped[str] = mapped_column(String(200), nullable=False)
    customer_phone_raw: Mapped[str] = mapped_column(String(30), nullable=False)
    customer_phone_e164: Mapped[str] = mapped_column(String(20), nullable=False)
    customer_phone_digits: Mapped[str] = mapped_column(String(20), nullable=False)
    customer_address: Mapped[str | None] = mapped_column(String(500), nullable=True)
    customer_province: Mapped[str | None] = mapped_column(String(100), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="SAR")
    subtotal_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0"))
    upsell_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0"))
    total_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0"))
    selected_offer_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    upsell_decision: Mapped[str | None] = mapped_column(String(20), nullable=True)
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    utm_source: Mapped[str | None] = mapped_column(String(200), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(200), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(200), nullable=True)
    utm_content: Mapped[str | None] = mapped_column(String(200), nullable=True)
    utm_term: Mapped[str | None] = mapped_column(String(200), nullable=True)
    fbclid: Mapped[str | None] = mapped_column(String(500), nullable=True)
    ttclid: Mapped[str | None] = mapped_column(String(500), nullable=True)
    snap_click_id: Mapped[str | None] = mapped_column(String(500), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
    event_id_initiate_checkout: Mapped[str | None] = mapped_column(String(100), nullable=True)
    event_id_purchase: Mapped[str | None] = mapped_column(String(100), nullable=True)
    webhook_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    # MaxMind geo enrichment — stored for CAPI and ops
    geo_country: Mapped[str | None] = mapped_column(String(10), nullable=True)
    geo_city: Mapped[str | None] = mapped_column(String(200), nullable=True)
    geo_subdivision: Mapped[str | None] = mapped_column(String(200), nullable=True)
    geo_postal_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    geo_latitude: Mapped[float | None] = mapped_column(nullable=True)
    geo_longitude: Mapped[float | None] = mapped_column(nullable=True)
    geo_is_vpn: Mapped[bool] = mapped_column(Boolean, default=False)
    geo_is_proxy: Mapped[bool] = mapped_column(Boolean, default=False)
    geo_risk_score: Mapped[float | None] = mapped_column(nullable=True)
    geo_source: Mapped[str | None] = mapped_column(String(30), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    items: Mapped[list[OrderItem]] = relationship("OrderItem", back_populates="order", lazy="selectin")
    tracking_events: Mapped[list[TrackingEvent]] = relationship(
        "TrackingEvent", back_populates="order", lazy="selectin"
    )
    webhook_deliveries: Mapped[list[WebhookDelivery]] = relationship(
        "WebhookDelivery", back_populates="order", lazy="selectin"
    )
