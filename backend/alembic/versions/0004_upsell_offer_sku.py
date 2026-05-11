"""add sku on upsell_offers for sheet webhooks

Revision ID: 0004_upsell_offer_sku
Revises: 0003_add_geo_fields
Create Date: 2026-05-11 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004_upsell_offer_sku"
down_revision: Union[str, None] = "0003_add_geo_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "upsell_offers",
        sa.Column("sku", sa.String(100), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("upsell_offers", "sku")
