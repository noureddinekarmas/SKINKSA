from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    __table_args__ = (
        Index("ix_analytics_events_created_valid", "created_at", "is_valid_traffic"),
        Index("ix_analytics_events_session_created", "session_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    product_slug: Mapped[str | None] = mapped_column(String(200), nullable=True)
    session_id: Mapped[str | None] = mapped_column(String(80), nullable=True)

    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)

    utm_source: Mapped[str | None] = mapped_column(String(200), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(200), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(200), nullable=True)

    geo_country: Mapped[str | None] = mapped_column(String(10), nullable=True)
    geo_is_vpn: Mapped[bool] = mapped_column(Boolean, default=False)
    geo_is_proxy: Mapped[bool] = mapped_column(Boolean, default=False)
    geo_is_tor: Mapped[bool] = mapped_column(Boolean, default=False)
    geo_is_hosting: Mapped[bool] = mapped_column(Boolean, default=False)
    secondary_vpn_detected: Mapped[bool] = mapped_column(Boolean, default=False)
    is_valid_traffic: Mapped[bool] = mapped_column(Boolean, default=False)
