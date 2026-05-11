# 07 - Backend FastAPI Architecture

## Stack

Use:

- Python 3.12
- FastAPI
- Pydantic v2 + pydantic-settings
- SQLAlchemy 2 async
- Alembic
- PostgreSQL
- httpx
- uvicorn

## Folder Structure

```text
backend/
  app/
    main.py
    api/
      v1/
        routes_health.py
        routes_products.py
        routes_orders.py
        routes_internal.py
    core/
      config.py
      security.py
      logging.py
    db/
      session.py
      base.py
    models/
    schemas/
    services/
      orders/
      tracking/
      webhooks/
      phone.py
      hashing.py
    seed/
  alembic/
  tests/
  Dockerfile
  entrypoint.sh
  pyproject.toml
```

## App Startup

Use FastAPI lifespan.

Startup tasks:

- load settings,
- initialize DB engine,
- run migrations if `RUN_MIGRATIONS_ON_START=true`,
- verify DB connectivity,
- initialize outbound HTTP client.

Shutdown:

- close DB connections,
- close HTTP client.

## Public API Endpoints

Health:

- `GET /v1/health`

Products:

- `GET /v1/products`
- `GET /v1/products/{slug}`

Orders:

- `POST /v1/orders/draft`
- `POST /v1/orders/{order_id}/upsell`
- `POST /v1/orders/{order_id}/finalize`
- `GET /v1/orders/{order_id}/summary`

## Internal API Endpoints

Protected with `INTERNAL_API_KEY`:

- `POST /v1/internal/orders/{order_id}/resend-webhook`
- `POST /v1/internal/orders/{order_id}/replay-tracking`

## Order Flow

`POST /orders/draft`:

- validates customer name and phone,
- normalizes phone,
- validates cart and offer,
- creates order status `draft`,
- stores attribution/click ids,
- stores event ids.

`POST /orders/{id}/upsell`:

- accepts or skips upsell,
- if accepted, adds upsell line at 99 SAR.

`POST /orders/{id}/finalize`:

- moves order to `pending_confirmation`,
- fires server CAPI events,
- sends Google Sheet webhook,
- returns thank-you summary token.

## Security

Required:

- strict CORS allowlist,
- no raw secrets in logs,
- no raw phone in tracking logs,
- rate limit order endpoints,
- validate request body with Pydantic,
- idempotency key support for finalize endpoint.

## CORS

Allow:

- `https://officialskinksa.store`
- local dev origin only in non-production.

## Backend Docker

Expose port `8000`.

Entrypoint:

1. run `alembic upgrade head` if enabled,
2. seed required product/offers if enabled,
3. start uvicorn.

Recommended command:

```text
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Scale containers via EasyPanel, not by overloading one container unless needed.
