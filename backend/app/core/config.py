from pydantic_settings import BaseSettings, SettingsConfigDict


def _split(raw: str) -> list[str]:
    """Split a comma-separated env var into a trimmed list, ignoring blanks."""
    return [item.strip() for item in raw.split(",") if item.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "SKINKSA API"
    APP_ENV: str = "production"
    APP_DEBUG: bool = False
    APP_SECRET_KEY: str = "change_me"
    # Stored as a plain comma-separated string so pydantic-settings never
    # tries to JSON-decode it. Use settings.cors_origins (property) in code.
    APP_CORS_ORIGINS: str = "https://officialskinksa.store"

    @property
    def cors_origins(self) -> list[str]:
        return _split(self.APP_CORS_ORIGINS)

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
    # Comma-separated phone numbers that bypass GeoIP checks.
    GEOIP_WHITELISTED_PHONES: str = "+212671147298"

    @property
    def geoip_whitelisted_phones(self) -> list[str]:
        return _split(self.GEOIP_WHITELISTED_PHONES)

    # Optional second opinion for VPN (see app/services/ip_intel_secondary.py)
    IPQUALITY_API_KEY: str = ""
    IPQUALITY_VPN_FRAUD_SCORE_THRESHOLD: float = 85.0

    # Admin dashboard (HTTP Basic). Leave empty to disable /v1/admin/*.
    ADMIN_BASIC_AUTH_USER: str = ""
    ADMIN_BASIC_AUTH_PASSWORD: str = ""


settings = Settings()
