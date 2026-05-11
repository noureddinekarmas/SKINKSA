# 13 - Coding Rules and Definition of Done

## General Rules

- Do not hardcode secrets.
- Keep pricing constants seeded in DB.
- Keep UI Arabic-first and RTL.
- Use strict TypeScript.
- Use typed Python.
- Keep components small and reusable.
- Prefer config/content files for marketing content.
- Avoid fake proof in production.

## Frontend Rules

- Use Server Components unless interactivity is required.
- Use Client Components for cart, checkout, upsell, and tracking.
- Validate checkout with Zod.
- Use accessible shadcn/ui Dialog/Sheet components.
- Use Next Image for all images.
- Use Next Script with `afterInteractive` for pixels.
- Store attribution values before checkout.

## Backend Rules

- API routes should be thin.
- Business logic belongs in service layer.
- Use Pydantic schemas for all requests/responses.
- Use SQLAlchemy models and Alembic migrations.
- Use idempotency for order finalization.
- Do not log raw phone numbers.

## Tests Required

Frontend:

- phone validation tests,
- cart total tests,
- offer selection tests,
- checkout popup integration test if test framework is set up.

Backend:

- phone normalization tests,
- hashing tests,
- draft/finalize endpoint tests,
- webhook payload tests,
- duplicate finalize idempotency test.

## Build Checks

Frontend:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Backend:

- `pytest`
- `ruff check` or equivalent,
- migration upgrade from empty DB.

## Definition of Done

The work is done only when:

- all required pages exist,
- mobile and desktop layouts are responsive,
- offer selection works,
- cart drawer works,
- cross-sell component exists,
- checkout popup validates Saudi phone,
- upsell interstitial works,
- order is saved in Postgres,
- webhook sends to Google Sheet,
- CAPI services are implemented behind env flags,
- browser pixels are deferred,
- dedup event IDs are shared,
- Docker images build,
- deployment docs/env examples are present.
