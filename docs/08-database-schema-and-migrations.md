# 08 - Database Schema and Migrations

## Database

Logical name: `SKINKSA`.

Actual database URL is injected through `DATABASE_URL`.

Existing EasyPanel internal connection:

```text
postgres://postgres:nu5dtxxmh267kdt09igt@skinksa_database:5432/skinksa?sslmode=disable
```

Use SQLAlchemy async driver format in app env:

```text
postgresql+psycopg://...
```

## Required Tables

### products

- `id` uuid primary key
- `slug` unique
- `sku`
- `title_ar`
- `title_en`
- `description_ar`
- `status`
- `base_image_url`
- `created_at`
- `updated_at`

### offers

- `id` uuid primary key
- `product_id`
- `code` (`OFFER_1`, `OFFER_2`, `OFFER_3`)
- `label_ar`
- `quantity`
- `price_sar`
- `compare_at_sar`
- `is_default`
- `badge_ar`
- `sort_order`
- `active`

### upsell_offers

- `id` uuid primary key
- `product_id`
- `title_ar`
- `price_sar` default `99`
- `active`
- `sort_order`

### orders

- `id` uuid primary key
- `order_number` unique
- `status`
- `customer_name`
- `customer_phone_raw`
- `customer_phone_e164`
- `customer_phone_digits`
- `currency`
- `subtotal_sar`
- `upsell_sar`
- `total_sar`
- `selected_offer_code`
- `upsell_decision`
- `source_url`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbclid`
- `ttclid`
- `snap_click_id`
- `user_agent`
- `ip_address`
- `created_at`
- `updated_at`

### order_items

- `id` uuid primary key
- `order_id`
- `product_id`
- `offer_id` nullable
- `upsell_offer_id` nullable
- `title_snapshot`
- `quantity`
- `unit_price_sar`
- `line_total_sar`
- `is_upsell`

### tracking_events

- `id` uuid primary key
- `order_id` nullable
- `platform`
- `event_name`
- `event_id`
- `channel` (`browser`, `server`)
- `status`
- `payload_json`
- `response_json`
- `error_message`
- `sent_at`
- `created_at`

### webhook_deliveries

- `id` uuid primary key
- `order_id`
- `target`
- `status`
- `attempt_count`
- `payload_json`
- `response_body`
- `last_error`
- `last_attempt_at`
- `created_at`

## Order Status Enum

Use:

- `draft`
- `pending_confirmation`
- `confirmed`
- `cancelled_unreachable`
- `cancelled_customer_refused`
- `shipped`
- `delivered`
- `returned`

## Seed Data

Seed main product:

- slug: `blueKSA`
- active status
- Arabic title from brief.

Seed offers:

- `OFFER_1`: quantity 1, price 129 SAR.
- `OFFER_2`: quantity 2, price 159 SAR, default true.
- `OFFER_3`: quantity 3, price 199 SAR.

Seed upsell:

- placeholder upsell product at 99 SAR, active only if content exists.

## Migration Rules

- Use Alembic.
- Initial migration creates schema.
- Seed script runs idempotently.
- Backend startup can run migrations when `RUN_MIGRATIONS_ON_START=true`.
- Never drop production columns without manual approval.

## Idempotency

Finalize endpoint should support idempotency:

- same order finalized twice should not duplicate sheet rows or CAPI purchase events.
- store `event_id_purchase` and webhook delivery status.
