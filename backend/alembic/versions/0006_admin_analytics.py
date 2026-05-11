"""admin analytics events + order geo tor/secondary vpn

Revision ID: 0006_admin_analytics
Revises: 0005_skinksa_product_skus
Create Date: 2026-05-11 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0006_admin_analytics"
down_revision: Union[str, None] = "0005_skinksa_product_skus"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "orders",
        sa.Column("geo_is_tor", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.add_column(
        "orders",
        sa.Column("geo_secondary_vpn", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.alter_column("orders", "geo_is_tor", server_default=None)
    op.alter_column("orders", "geo_secondary_vpn", server_default=None)

    op.create_table(
        "analytics_events",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("event_type", sa.String(length=50), nullable=False),
        sa.Column("path", sa.String(length=500), nullable=True),
        sa.Column("product_slug", sa.String(length=200), nullable=True),
        sa.Column("session_id", sa.String(length=80), nullable=True),
        sa.Column("ip_address", sa.String(length=50), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("utm_source", sa.String(length=200), nullable=True),
        sa.Column("utm_medium", sa.String(length=200), nullable=True),
        sa.Column("utm_campaign", sa.String(length=200), nullable=True),
        sa.Column("geo_country", sa.String(length=10), nullable=True),
        sa.Column("geo_is_vpn", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("geo_is_proxy", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("geo_is_tor", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("geo_is_hosting", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("secondary_vpn_detected", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("is_valid_traffic", sa.Boolean(), nullable=False, server_default="false"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_analytics_events_created_valid",
        "analytics_events",
        ["created_at", "is_valid_traffic"],
        unique=False,
    )
    op.create_index(
        "ix_analytics_events_session_created",
        "analytics_events",
        ["session_id", "created_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_analytics_events_session_created", table_name="analytics_events")
    op.drop_index("ix_analytics_events_created_valid", table_name="analytics_events")
    op.drop_table("analytics_events")
    op.drop_column("orders", "geo_secondary_vpn")
    op.drop_column("orders", "geo_is_tor")
