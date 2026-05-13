from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.order import (
    DraftOrderRequest,
    UpsellRequest,
    FinalizeRequest,
    OrderOut,
    OrderSummaryOut,
)
from app.services.orders import draft as draft_svc
from app.services.orders import upsell as upsell_svc
from app.services.orders import finalize as finalize_svc
from app.services.orders import summary as summary_svc

router = APIRouter(prefix="/orders", tags=["orders"])


def _real_ip(request: Request) -> str | None:
    """Extract the real client IP, respecting common proxy headers."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else None


@router.post("/draft", response_model=OrderOut, status_code=201)
async def create_draft_order(
    payload: DraftOrderRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    if payload.attribution is None:
        from app.schemas.order import AttributionInput
        payload.attribution = AttributionInput()

    client_ip = _real_ip(request)

    if not payload.attribution.ip_address:
        payload.attribution.ip_address = client_ip
    if not payload.attribution.user_agent:
        payload.attribution.user_agent = request.headers.get("user-agent")

    order = await draft_svc.create_draft_order(db, payload)
    return order


@router.post("/{order_id}/upsell", response_model=OrderOut)
async def upsell_order(
    order_id: str,
    payload: UpsellRequest,
    db: AsyncSession = Depends(get_db),
):
    order = await upsell_svc.process_upsell(db, order_id, payload)
    return order


@router.post("/{order_id}/finalize", response_model=OrderSummaryOut)
async def finalize_order(
    order_id: str,
    payload: FinalizeRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await finalize_svc.finalize_order(db, order_id, payload)
    return OrderSummaryOut(order=result["order"], thank_you_token=result["thank_you_token"])


@router.get("/{order_id}/summary", response_model=OrderSummaryOut)
async def get_order_summary(
    order_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await summary_svc.get_order_summary(db, order_id)
    return OrderSummaryOut(order=result["order"], thank_you_token=result["thank_you_token"])
