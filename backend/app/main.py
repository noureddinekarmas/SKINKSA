from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import routes_health, routes_internal, routes_orders, routes_products
from app.core.config import settings
from app.core.logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    if settings.RUN_MIGRATIONS_ON_START:
        import subprocess

        subprocess.run(["alembic", "upgrade", "head"], check=True)
    if settings.SEED_ON_START:
        from app.seed.seed_initial_data import run_seed

        await run_seed()
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

origins = list(settings.APP_CORS_ORIGINS)
if settings.APP_ENV != "production":
    origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_health.router, prefix="/v1")
app.include_router(routes_products.router, prefix="/v1")
app.include_router(routes_orders.router, prefix="/v1")
app.include_router(routes_internal.router, prefix="/v1")
