"""
Idempotent seed script for SKINKSA initial product data.
Can be run as: python -m app.seed.seed_initial_data
"""

import asyncio
import uuid
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session_factory
from app.models.offer import Offer
from app.models.product import Product
from app.models.upsell_offer import UpsellOffer

PRODUCT_SLUG = "blueskin"


async def run_seed(db: AsyncSession | None = None) -> None:
    close_session = db is None
    if db is None:
        db = async_session_factory()

    try:
        result = await db.execute(select(Product).where(Product.slug == PRODUCT_SLUG))
        product = result.scalar_one_or_none()

        if product is None:
            product = Product(
                id=uuid.uuid4(),
                slug=PRODUCT_SLUG,
                sku="SKINKSA-PEP-30ML",
                title_ar="سيروم ببتيد النحاس الأزرق SKINKSA — منتج واحد: الببتيد لشد البشرة وتجديدها، 30 مل",
                title_en="SKINKSA Blue Copper Peptide Serum — 30ml",
                status="active",
            )
            db.add(product)
            await db.flush()
            print(f"[seed] Created product: {PRODUCT_SLUG}")
        else:
            print(f"[seed] Product already exists: {PRODUCT_SLUG}")

        offers_result = await db.execute(select(Offer).where(Offer.product_id == product.id))
        existing_offers = list(offers_result.scalars().all())

        if not existing_offers:
            offers = [
                Offer(
                    id=uuid.uuid4(),
                    product_id=product.id,
                    code="OFFER_1",
                    label_ar="تجربة أولى",
                    quantity=1,
                    price_sar=Decimal("129"),
                    compare_at_sar=None,
                    is_default=False,
                    badge_ar=None,
                    sort_order=1,
                    active=True,
                ),
                Offer(
                    id=uuid.uuid4(),
                    product_id=product.id,
                    code="OFFER_2",
                    label_ar="الأفضل قيمة",
                    quantity=2,
                    price_sar=Decimal("159"),
                    compare_at_sar=Decimal("258"),
                    is_default=True,
                    badge_ar="الأكثر اختيارًا",
                    sort_order=2,
                    active=True,
                ),
                Offer(
                    id=uuid.uuid4(),
                    product_id=product.id,
                    code="OFFER_3",
                    label_ar="أعلى توفير",
                    quantity=3,
                    price_sar=Decimal("199"),
                    compare_at_sar=Decimal("387"),
                    is_default=False,
                    badge_ar="عرض محدود",
                    sort_order=3,
                    active=True,
                ),
            ]
            for offer in offers:
                db.add(offer)
            print("[seed] Created 3 offers")
        else:
            print(f"[seed] Offers already exist ({len(existing_offers)} found)")

        upsell_result = await db.execute(
            select(UpsellOffer).where(UpsellOffer.product_id == product.id)
        )
        existing_upsell = upsell_result.scalar_one_or_none()

        if existing_upsell is None:
            upsell = UpsellOffer(
                id=uuid.uuid4(),
                product_id=product.id,
                title_ar="الببتيد — إضافة مكمّلة لنفس المنتج",
                sku="SKINKSA-PEP-ADDON",
                price_sar=Decimal("99"),
                active=False,
                sort_order=1,
            )
            db.add(upsell)
            print("[seed] Created upsell offer")
        else:
            print("[seed] Upsell offer already exists")

        await db.commit()
        print("[seed] Done.")
    finally:
        if close_session:
            await db.close()


if __name__ == "__main__":
    asyncio.run(run_seed())
