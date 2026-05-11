from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class OfferOut(BaseModel):
    id: UUID
    code: str
    label_ar: Optional[str] = None
    quantity: int
    price_sar: Decimal
    compare_at_sar: Optional[Decimal] = None
    is_default: bool
    badge_ar: Optional[str] = None
    sort_order: int

    model_config = {"from_attributes": True}


class ProductOut(BaseModel):
    id: UUID
    slug: str
    title_ar: str
    title_en: Optional[str] = None
    description_ar: Optional[str] = None
    status: str
    base_image_url: Optional[str] = None
    offers: list[OfferOut] = []

    model_config = {"from_attributes": True}
