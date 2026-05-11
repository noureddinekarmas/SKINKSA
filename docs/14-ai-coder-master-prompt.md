# 14 - AI Coder Master Prompt

Copy this prompt into the AI coder:

---

You are the lead full-stack engineer for SKINKSA, a premium Arabic-first DTC skincare store for KSA.

Build the project from the documentation in `docs/`. Do not improvise away from the docs unless there is a real technical blocker. If you find a conflict, prefer the latest and most specific doc.

## Required Reading

Read these files first, in order:

1. `docs/README.md`
2. `docs/00-project-brief.md`
3. `docs/01-brand-positioning-icp.md`
4. `docs/02-arabic-copy-cro-language.md`
5. `docs/03-site-map-and-page-specs.md`
6. `docs/04-funnel-offers-cart-checkout-upsell.md`
7. `docs/05-design-system-and-ux.md`
8. `docs/06-frontend-nextjs-architecture.md`
9. `docs/07-backend-fastapi-architecture.md`
10. `docs/08-database-schema-and-migrations.md`
11. `docs/09-tracking-pixels-capi-dedup.md`
12. `docs/10-google-sheets-webhook-and-ops.md`
13. `docs/11-docker-easypanel-deployment.md`
14. `docs/12-compliance-proof-and-content-ops.md`
15. `docs/13-coding-rules-and-definition-of-done.md`

## Build Output

Create:

- `frontend/` with a production-ready Next.js App Router storefront.
- `backend/` with a production-ready FastAPI API.

Keep the `docs/` folder intact.

## Business Requirements

- Arabic-first, RTL, KSA-focused.
- Premium branded store, not generic dropshipping.
- Brand name: `SKINKSA`.
- Domain: `officialskinksa.store`.
- API domain: `api.officialskinksa.store`.
- COD only.
- Main product:
  `سيروم ببتيد النحاس الأزرق لشد البشرة وتجديدها، مضاد للشيخوخة، 30 مل - تركيبة منشطة للبشرة مع خلاصة مُشرقة`
- Offers:
  - 1 piece: 129 SAR
  - 2 pieces: 159 SAR
  - 3 pieces: 199 SAR
- Post-submit upsell: 99 SAR.

## Required Frontend

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand
- React Hook Form + Zod

Implement pages:

- Home
- Collection
- Product landing page
- About
- Contact
- Thank-you
- Policy pages

Implement UX:

- header with circle `N` monogram and SKINKSA text logo,
- offer selector,
- add-to-cart opens cart drawer,
- cart cross-sell carousel,
- checkout popup with only name + KSA phone,
- 10-15 second upsell interstitial,
- responsive mobile-first layout,
- placeholder images ready for replacement.

## Required Backend

Use:

- Python 3.12
- FastAPI
- SQLAlchemy async
- Alembic
- PostgreSQL
- Pydantic Settings

Implement:

- product endpoints,
- order draft endpoint,
- upsell decision endpoint,
- finalize endpoint,
- order summary endpoint,
- migrations,
- seed data,
- Google Sheets webhook,
- CAPI service modules.

Backend must run migrations on startup when env says so.

## Tracking

Implement deferred browser pixels:

- Meta
- TikTok
- Snapchat

Implement server-side:

- Meta CAPI
- TikTok Events API
- Snapchat CAPI

Rules:

- hash PII on backend,
- normalize KSA phone correctly,
- share one `event_id` between browser and server events for dedup,
- make all CAPI providers env-flag controlled.

## Deployment

Add Dockerfiles:

- frontend exposes `3000`.
- backend exposes `8000`.

Add `.env.example` files based on `docs/env/`.

Make it ready for EasyPanel.

## Quality Bar

Do not stop at placeholders only. Deliver a runnable app with:

- completed routes,
- styled responsive UI,
- working cart/checkout/upsell flow,
- database schema and migrations,
- webhook integration,
- tracking modules,
- build scripts,
- tests for phone normalization and order totals.

Run lint/typecheck/build/tests. Fix errors before handoff.

---
