"""rename main product slug to blueKSA

Revision ID: 0007_product_slug_blueksa
Revises: 0006_admin_analytics
Create Date: 2026-05-12 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "0007_product_slug_blueksa"
down_revision: Union[str, None] = "0006_admin_analytics"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

OLD_SLUG = "blue-copper-peptide-serum"
NEW_SLUG = "blueKSA"


def upgrade() -> None:
    op.execute(
        f"UPDATE products SET slug = '{NEW_SLUG}' WHERE slug = '{OLD_SLUG}'"
    )


def downgrade() -> None:
    op.execute(
        f"UPDATE products SET slug = '{OLD_SLUG}' WHERE slug = '{NEW_SLUG}'"
    )
