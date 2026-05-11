"""add MaxMind geo fields to orders

Revision ID: 0003_add_geo_fields
Revises: 0002_add_address_and_province
Create Date: 2026-05-11 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003_add_geo_fields"
down_revision: Union[str, None] = "0002_add_address_and_province"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("geo_country", sa.String(10), nullable=True))
    op.add_column("orders", sa.Column("geo_city", sa.String(200), nullable=True))
    op.add_column("orders", sa.Column("geo_subdivision", sa.String(200), nullable=True))
    op.add_column("orders", sa.Column("geo_postal_code", sa.String(20), nullable=True))
    op.add_column("orders", sa.Column("geo_latitude", sa.Float(), nullable=True))
    op.add_column("orders", sa.Column("geo_longitude", sa.Float(), nullable=True))
    op.add_column(
        "orders",
        sa.Column("geo_is_vpn", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.add_column(
        "orders",
        sa.Column("geo_is_proxy", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.add_column("orders", sa.Column("geo_risk_score", sa.Float(), nullable=True))
    op.add_column("orders", sa.Column("geo_source", sa.String(30), nullable=True))


def downgrade() -> None:
    op.drop_column("orders", "geo_source")
    op.drop_column("orders", "geo_risk_score")
    op.drop_column("orders", "geo_is_proxy")
    op.drop_column("orders", "geo_is_vpn")
    op.drop_column("orders", "geo_longitude")
    op.drop_column("orders", "geo_latitude")
    op.drop_column("orders", "geo_postal_code")
    op.drop_column("orders", "geo_subdivision")
    op.drop_column("orders", "geo_city")
    op.drop_column("orders", "geo_country")
