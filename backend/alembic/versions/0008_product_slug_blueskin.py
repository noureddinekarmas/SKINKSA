"""set main product slug to blueskin

Revision ID: 0008_product_slug_blueskin
Revises: 0007_product_slug_blueksa
Create Date: 2026-05-12 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "0008_product_slug_blueskin"
down_revision: Union[str, None] = "0007_product_slug_blueksa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

NEW_SLUG = "blueskin"


def upgrade() -> None:
    op.execute(
        f"UPDATE products SET slug = '{NEW_SLUG}' "
        f"WHERE slug IN ('blueKSA', 'blue-copper-peptide-serum', 'blueksa')"
    )


def downgrade() -> None:
    op.execute(
        f"UPDATE products SET slug = 'blueKSA' WHERE slug = '{NEW_SLUG}'"
    )
