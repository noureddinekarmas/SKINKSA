"""Align SKUs and Arabic title with SKINKSA single peptide product

Revision ID: 0005_skinksa_product_skus
Revises: 0004_upsell_offer_sku
Create Date: 2026-05-11 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "0005_skinksa_product_skus"
down_revision: Union[str, None] = "0004_upsell_offer_sku"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE products
        SET
            sku = 'SKINKSA-PEP-30ML',
            title_ar = 'سيروم ببتيد النحاس الأزرق SKINKSA — منتج واحد: الببتيد لشد البشرة وتجديدها، 30 مل',
            title_en = 'SKINKSA Blue Copper Peptide Serum — 30ml'
        WHERE slug = 'blue-copper-peptide-serum'
        """
    )
    op.execute(
        """
        UPDATE upsell_offers
        SET
            sku = 'SKINKSA-PEP-ADDON',
            title_ar = 'الببتيد — إضافة مكمّلة لنفس المنتج'
        WHERE product_id IN (
            SELECT id FROM products WHERE slug = 'blue-copper-peptide-serum'
        )
        """
    )


def downgrade() -> None:
    pass
