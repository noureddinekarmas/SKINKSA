from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from typing import Optional


class CartItemInput(BaseModel):
    product_id: Optional[str] = None
    offer_code: str
    quantity: int
    unit_price_sar: Decimal
    title_snapshot: str


class AttributionInput(BaseModel):
    source_url: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    fbclid: Optional[str] = None
    ttclid: Optional[str] = None
    snap_click_id: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None


class EventIdsInput(BaseModel):
    initiate_checkout: Optional[str] = None
    add_to_cart: Optional[str] = None


class DraftOrderRequest(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: Optional[str] = None
    customer_province: Optional[str] = None
    checkout_currency: Optional[str] = None
    cart_items: list[CartItemInput]
    attribution: Optional[AttributionInput] = None
    event_ids: Optional[EventIdsInput] = None


class UpsellRequest(BaseModel):
    accepted: bool
    upsell_offer_id: Optional[str] = None
    event_id: Optional[str] = None


class FinalizeRequest(BaseModel):
    event_id_purchase: Optional[str] = None
    idempotency_key: Optional[str] = None


class OrderItemOut(BaseModel):
    id: UUID
    title_snapshot: str
    quantity: int
    unit_price_sar: Decimal
    line_total_sar: Decimal
    is_upsell: bool

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: UUID
    order_number: str
    status: str
    customer_name: str
    customer_phone_e164: str
    customer_address: Optional[str] = None
    customer_province: Optional[str] = None
    currency: str
    subtotal_sar: Decimal
    upsell_sar: Decimal
    total_sar: Decimal
    selected_offer_code: Optional[str] = None
    upsell_decision: Optional[str] = None
    items: list[OrderItemOut] = []

    model_config = {"from_attributes": True}


class OrderSummaryOut(BaseModel):
    order: OrderOut
    thank_you_token: str
