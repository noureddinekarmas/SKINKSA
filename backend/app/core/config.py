import json
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _parse_str_list(v: Any) -> list[str]:
    """Accept a JSON array string, a comma-separated string, or a list."""
    if isinstance(v, list):
        return v
    if isinstance(v, str):
        stripped = v.strip()
        if not stripped:
            return []
        if stripped.startswith("["):
            return json.loads(stripped)
        return [item.strip() for item in stripped.split(",") if item.strip()]
    return v


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "SKINKSA API"
    APP_ENV: str = "production"
    APP_DEBUG: bool = False
    APP_SECRET_KEY: str = "change_me"
    APP_CORS_ORIGINS: list[str] = ["https://officialskinksa.store"]

    @field_validator("APP_CORS_ORIGINS", "GEOIP_WHITELISTED_PHONES", mode="before")
    @classmethod
    def parse_list(cls, v: Any) -> Any:
        return _parse_str_list(v)

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RUN_MIGRATIONS_ON_START: bool = False
    SEED_ON_START: bool = False

    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/skinksa"

    DEFAULT_COUNTRY_CODE: str = "966"
    DEFAULT_CURRENCY: str = "SAR"
    ORDER_NUMBER_PREFIX: str = "SK"
    ORDER_NUMBER_START: int = 10001

    ORDERS_WEBHOOK_URL: str = ""
    ORDERS_WEBHOOK_TOKEN: str = ""
    ORDERS_WEBHOOK_TIMEOUT_SECONDS: int = 10

    META_CAPI_ENABLED: bool = False
    META_PIXEL_ID: str = ""
    META_ACCESS_TOKEN: str = ""
    META_TEST_EVENT_CODE: str = ""

    TIKTOK_CAPI_ENABLED: bool = False
    TIKTOK_PIXEL_CODE: str = ""
    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_TEST_EVENT_CODE: str = ""

    SNAP_CAPI_ENABLED: bool = False
    SNAP_PIXEL_ID: str = ""
    SNAP_ACCESS_TOKEN: str = ""
    SNAP_TEST_EVENT_CODE: str = ""

    INTERNAL_API_KEY: str = "change_me_internal_key"
    RATE_LIMIT_ORDERS_PER_MINUTE: int = 20

    # MaxMind GeoIP2
    # Use web service (GeoIP2 Insights) OR local DB — not both.
    # Web service: set MAXMIND_ACCOUNT_ID + MAXMIND_LICENSE_KEY
    # Local DB:    set MAXMIND_DB_PATH to absolute path of GeoIP2-City.mmdb / GeoLite2-City.mmdb
    MAXMIND_ENABLED: bool = False
    MAXMIND_ACCOUNT_ID: int = 0
    MAXMIND_LICENSE_KEY: str = ""
    MAXMIND_DB_PATH: str = ""          # e.g. /data/GeoLite2-City.mmdb
    MAXMIND_BLOCK_NON_SA: bool = False # block non-SA IPs (set True in prod)
    MAXMIND_BLOCK_VPN: bool = False    # block VPN/proxy/Tor IPs
    MAXMIND_RISK_SCORE_THRESHOLD: float = 75.0  # block if insights risk_score > this (0=off)
    GEOIP_WHITELISTED_PHONES: list[str] = ["+212671147298"]


settings = Settings()
