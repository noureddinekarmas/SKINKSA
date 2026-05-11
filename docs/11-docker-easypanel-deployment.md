# 11 - Docker and EasyPanel Deployment

## Services

Deploy two services:

1. Frontend
   - folder: `frontend/`
   - domain: `officialskinksa.store`
   - port: `3000`

2. Backend
   - folder: `backend/`
   - domain: `api.officialskinksa.store`
   - port: `8000`

PostgreSQL is already installed in EasyPanel.

## Frontend Docker Requirements

Use a multi-stage Dockerfile:

- Node 20+,
- install with lockfile,
- build Next.js,
- run `next start`,
- expose `3000`.

Required env:

- public site URL,
- API base URL,
- web pixel IDs,
- feature flags.

## Backend Docker Requirements

Use:

- Python 3.12 slim,
- install dependencies,
- copy app,
- entrypoint runs migrations if enabled,
- start uvicorn,
- expose `8000`.

Entrypoint flow:

```text
if RUN_MIGRATIONS_ON_START=true:
  alembic upgrade head

if SEED_ON_START=true:
  python -m app.seed.seed_initial_data

uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Environment Files

Use:

- `docs/env/frontend.env.example`
- `docs/env/backend.env.example`

Do not commit production secrets.

## CORS

Backend must allow:

- `https://officialskinksa.store`

In development only:

- `http://localhost:3000`

## SSL

EasyPanel should issue TLS for:

- `officialskinksa.store`
- `api.officialskinksa.store`

Force HTTPS.

## Health Checks

Frontend:

- `/` must return 200.

Backend:

- `/v1/health` returns:

```json
{ "ok": true }
```

## Launch Smoke Test

After deploy:

1. Open home page on mobile viewport.
2. Open product page.
3. Select 2pc offer.
4. Add to cart.
5. Open checkout.
6. Validate wrong phone rejects.
7. Submit valid KSA phone.
8. Accept upsell.
9. Confirm thank-you page.
10. Confirm row in Google Sheet.
11. Confirm browser pixels fire.
12. Confirm CAPI events received.
