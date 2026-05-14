"""competitive offer ladder: premium 1/2, anchor 3@199 SAR default

Revision ID: 0009_competitive_offer_ladder
Revises: 0008_product_slug_blueskin
Create Date: 2026-05-13 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "0009_competitive_offer_ladder"
down_revision: Union[str, None] = "0008_product_slug_blueskin"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE offers AS o
        SET
            price_sar = v.price_sar,
            compare_at_sar = v.compare_at_sar,
            is_default = v.is_default,
            badge_ar = v.badge_ar,
            label_ar = v.label_ar
        FROM products AS p,
        (VALUES
            ('OFFER_1',
             179.00::numeric,
             229.00::numeric,
             false,
             NULL::varchar,
             'عبوة واحدة · ٣٠ مل'),
            ('OFFER_2',
             189.00::numeric,
             358.00::numeric,
             false,
             'خيار متوازن',
             'عبوتان · مدة استخدام أوضح للروتين'),
            ('OFFER_3',
             199.00::numeric,
             537.00::numeric,
             true,
             'أفضل قيمة للعبوة',
             'ثلاث عبوات · للالتزام دون انقطاع')
        ) AS v(code, price_sar, compare_at_sar, is_default, badge_ar, label_ar)
        WHERE o.product_id = p.id
          AND p.slug = 'blueskin'
          AND o.code = v.code
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE offers AS o
        SET
            price_sar = v.price_sar,
            compare_at_sar = v.compare_at_sar,
            is_default = v.is_default,
            badge_ar = v.badge_ar,
            label_ar = v.label_ar
        FROM products AS p,
        (VALUES
            ('OFFER_1',
             129.00::numeric,
             NULL::numeric,
             false,
             NULL::varchar,
             'تجربة أولى'),
            ('OFFER_2',
             159.00::numeric,
             258.00::numeric,
             true,
             'الأكثر اختيارًا',
             'الأفضل قيمة'),
            ('OFFER_3',
             199.00::numeric,
             387.00::numeric,
             false,
             'عرض محدود',
             'أعلى توفير')
        ) AS v(code, price_sar, compare_at_sar, is_default, badge_ar, label_ar)
        WHERE o.product_id = p.id
          AND p.slug = 'blueskin'
          AND o.code = v.code
        """
    )
