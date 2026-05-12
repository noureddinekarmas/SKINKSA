# SKINKSA Build Documentation

This documentation pack was restarted from zero for the SKINKSA KSA DTC ecommerce build.

Goal: build a premium Arabic-first branded skincare store for `officialskinksa.store`, backed by a FastAPI backend at `api.officialskinksa.store`, optimized for COD conversion, high AOV, authority, social proof, and paid traffic from Snapchat/TikTok/Meta.

## Required Build Output

The AI coder must create:

- `frontend/` - Next.js storefront.
- `backend/` - FastAPI API.
- Docker support for both services.
- PostgreSQL migrations and seed data.
- Google Sheets webhook integration.
- Browser pixels and server-side CAPI tracking.
- Env examples and deployment-ready config.

## Read Order

1. `00-project-brief.md`
2. `01-brand-positioning-icp.md`
3. `02-arabic-copy-cro-language.md`
4. `03-site-map-and-page-specs.md`
5. `04-funnel-offers-cart-checkout-upsell.md`
6. `05-design-system-and-ux.md`
7. `06-frontend-nextjs-architecture.md`
8. `07-backend-fastapi-architecture.md`
9. `08-database-schema-and-migrations.md`
10. `09-tracking-pixels-capi-dedup.md`
11. `10-google-sheets-webhook-and-ops.md`
12. `11-docker-easypanel-deployment.md`
13. `12-compliance-proof-and-content-ops.md`
14. `13-coding-rules-and-definition-of-done.md`
15. `14-ai-coder-master-prompt.md`

## Support Files

- `env/frontend.env.example`
- `env/backend.env.example`
- `templates/orders_sheet_template.csv`
- `templates/order_items_sheet_template.csv`
- `templates/tracking_events_sheet_template.csv`
- `templates/google-apps-script/skinksa-orders-webhook.js`

## Fixed Business Constants

- Brand: `SKINKSA`
- Store domain: `https://officialskinksa.store`
- API domain: `https://api.officialskinksa.store`
- Currency: `SAR`
- Country: `SA`
- Language: Arabic-first, RTL.
- Checkout model: COD only.
- Main product slug: `blueskin`
- Main product title: `سيروم ببتيد النحاس الأزرق لشد البشرة وتجديدها، مضاد للشيخوخة، 30 مل - تركيبة منشطة للبشرة مع خلاصة مُشرقة`
- Offers:
  - 1 piece: `129 SAR`
  - 2 pieces: `159 SAR`
  - 3 pieces: `199 SAR`
- One-time post-submit upsell: `99 SAR`

## Existing Infrastructure

EasyPanel PostgreSQL internal URL:

```text
postgres://postgres:nu5dtxxmh267kdt09igt@skinksa_database:5432/skinksa?sslmode=disable
```

Implementation note: never hardcode this in source code. Put it in backend environment variables.
