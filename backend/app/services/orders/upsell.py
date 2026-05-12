import uuid
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.upsell_offer import UpsellOffer
from app.schemas.order import UpsellRequest

UPSELL_PRICE_BY_CURRENCY = {
    "SAR": Decimal("99"),
    "QAR": Decimal("99"),
    "KWD": Decimal("8"),
}
UPSELL_TITLE = "منتج مكمل مميز"


def _default_upsell_price(order: Order) -> Decimal:
    c = (order.currency or "SAR").upper()
    return UPSELL_PRICE_BY_CURRENCY.get(c, Decimal("99"))


async def process_upsell(db: AsyncSession, order_id: str, payload: UpsellRequest) -> Order:
    result = await db.execute(select(Order).where(Order.id == uuid.UUID(order_id)))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.upsell_decision is not None:
        return order

    if payload.accepted:
        upsell_offer = None
        if payload.upsell_offer_id:
            upsell_result = await db.execute(
                select(UpsellOffer).where(UpsellOffer.id == uuid.UUID(payload.upsell_offer_id))
            )
            upsell_offer = upsell_result.scalar_one_or_none()

        upsell_price = upsell_offer.price_sar if upsell_offer else _default_upsell_price(order)
        upsell_title = upsell_offer.title_ar if upsell_offer else UPSELL_TITLE

        upsell_item = OrderItem(
            id=uuid.uuid4(),
            order_id=order.id,
            upsell_offer_id=upsell_offer.id if upsell_offer else None,
            title_snapshot=upsell_title or UPSELL_TITLE,
            quantity=1,
            unit_price_sar=upsell_price,
            line_total_sar=upsell_price,
            is_upsell=True,
        )
        db.add(upsell_item)

        order.upsell_sar = upsell_price
        order.total_sar = order.subtotal_sar + upsell_price
        order.upsell_decision = "accepted"
    else:
        order.upsell_decision = "skipped"

    await db.commit()
    refreshed = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order.id)
    )
    return refreshed.scalar_one()
