from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "SKINKSA API"
    APP_ENV: str = "production"
    APP_DEBUG: bool = False
    APP_SECRET_KEY: str = "change_me"
    APP_CORS_ORIGINS: list[str] = ["https://officialskinksa.store"]

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

    MAXMIND_ACCOUNT_ID: int = 0
    MAXMIND_LICENSE_KEY: str = ""
    MAXMIND_ENABLED: bool = True
    GEOIP_ALLOWED_COUNTRY: str = "SA"
    GEOIP_WHITELISTED_PHONES: list[str] = ["0671147298"]


settings = Settings()
