from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.order import Order


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("products.id"), nullable=True
    )
    offer_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("offers.id"), nullable=True)
    upsell_offer_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("upsell_offers.id"), nullable=True
    )
    title_snapshot: Mapped[str] = mapped_column(Text, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    line_total_sar: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    is_upsell: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    order: Mapped[Order] = relationship("Order", back_populates="items")
