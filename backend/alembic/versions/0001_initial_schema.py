"""initial schema

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("slug", sa.String(200), nullable=False),
        sa.Column("sku", sa.String(100), nullable=True),
        sa.Column("title_ar", sa.Text(), nullable=False),
        sa.Column("title_en", sa.Text(), nullable=True),
        sa.Column("description_ar", sa.Text(), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="active"),
        sa.Column("base_image_url", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )

    op.create_table(
        "offers",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("product_id", sa.UUID(), nullable=False),
        sa.Column("code", sa.String(50), nullable=False),
        sa.Column("label_ar", sa.String(200), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("price_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("compare_at_sar", sa.Numeric(10, 2), nullable=True),
        sa.Column("is_default", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("badge_ar", sa.String(100), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "upsell_offers",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("product_id", sa.UUID(), nullable=False),
        sa.Column("title_ar", sa.Text(), nullable=True),
        sa.Column("price_sar", sa.Numeric(10, 2), nullable=False, server_default="99"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "orders",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("order_number", sa.String(50), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="draft"),
        sa.Column("customer_name", sa.String(200), nullable=False),
        sa.Column("customer_phone_raw", sa.String(30), nullable=False),
        sa.Column("customer_phone_e164", sa.String(20), nullable=False),
        sa.Column("customer_phone_digits", sa.String(20), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="SAR"),
        sa.Column("subtotal_sar", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("upsell_sar", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("total_sar", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("selected_offer_code", sa.String(50), nullable=True),
        sa.Column("upsell_decision", sa.String(20), nullable=True),
        sa.Column("source_url", sa.Text(), nullable=True),
        sa.Column("utm_source", sa.String(200), nullable=True),
        sa.Column("utm_medium", sa.String(200), nullable=True),
        sa.Column("utm_campaign", sa.String(200), nullable=True),
        sa.Column("utm_content", sa.String(200), nullable=True),
        sa.Column("utm_term", sa.String(200), nullable=True),
        sa.Column("fbclid", sa.String(500), nullable=True),
        sa.Column("ttclid", sa.String(500), nullable=True),
        sa.Column("snap_click_id", sa.String(500), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("ip_address", sa.String(50), nullable=True),
        sa.Column("event_id_initiate_checkout", sa.String(100), nullable=True),
        sa.Column("event_id_purchase", sa.String(100), nullable=True),
        sa.Column("webhook_sent", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("order_number"),
    )

    op.create_table(
        "order_items",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("order_id", sa.UUID(), nullable=False),
        sa.Column("product_id", sa.UUID(), nullable=True),
        sa.Column("offer_id", sa.UUID(), nullable=True),
        sa.Column("upsell_offer_id", sa.UUID(), nullable=True),
        sa.Column("title_snapshot", sa.Text(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("line_total_sar", sa.Numeric(10, 2), nullable=False),
        sa.Column("is_upsell", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["offer_id"], ["offers.id"]),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.ForeignKeyConstraint(["upsell_offer_id"], ["upsell_offers.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "tracking_events",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("order_id", sa.UUID(), nullable=True),
        sa.Column("platform", sa.String(50), nullable=False),
        sa.Column("event_name", sa.String(100), nullable=False),
        sa.Column("event_id", sa.String(100), nullable=True),
        sa.Column("channel", sa.String(20), nullable=False, server_default="server"),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("payload_json", sa.Text(), nullable=True),
        sa.Column("response_json", sa.Text(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "webhook_deliveries",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("order_id", sa.UUID(), nullable=False),
        sa.Column("target", sa.String(100), nullable=False, server_default="google_sheets"),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("attempt_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("payload_json", sa.Text(), nullable=True),
        sa.Column("response_body", sa.Text(), nullable=True),
        sa.Column("last_error", sa.Text(), nullable=True),
        sa.Column("last_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index("ix_orders_order_number", "orders", ["order_number"])
    op.create_index("ix_products_slug", "products", ["slug"])
    op.create_index("ix_tracking_events_order_id", "tracking_events", ["order_id"])
    op.create_index("ix_webhook_deliveries_order_id", "webhook_deliveries", ["order_id"])


def downgrade() -> None:
    op.drop_table("webhook_deliveries")
    op.drop_table("tracking_events")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("upsell_offers")
    op.drop_table("offers")
    op.drop_table("products")
