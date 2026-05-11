import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.order import Order


async def get_order_summary(db: AsyncSession, order_id: str) -> dict:
    try:
        oid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == oid)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return {"order": order, "thank_you_token": str(order.id)}
