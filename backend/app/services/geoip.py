"""
MaxMind GeoIP2 service.

Supports two modes (configure one or the other via env vars):
  • Web Service  — MAXMIND_ACCOUNT_ID + MAXMIND_LICENSE_KEY
                   Requires GeoIP2 Insights subscription for full fraud signals.
                   GeoIP2 City gives basic geo without fraud scores.
  • Local DB     — MAXMIND_DB_PATH pointing to GeoIP2-City.mmdb or GeoLite2-City.mmdb
                   Free with GeoLite2; no fraud signals, city/postal/subdivision only.

Provides:
  1. lookup(ip) → GeoData  — full geo + fraud enrichment for CAPI and order storage
  2. check_ip(ip) → GeoIPResult  — runs lookup; always allowed (no order blocking)

lookups are fail-open: MaxMind errors return empty GeoData — callers should not block checkout.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

import geoip2.errors
import geoip2.webservice

from app.core.config import settings

logger = logging.getLogger(__name__)

# Private / reserved IP prefixes — skip lookup for these.
_PRIVATE_PREFIXES = (
    "10.", "127.", "::1",
    "172.16.", "172.17.", "172.18.", "172.19.", "172.20.",
    "172.21.", "172.22.", "172.23.", "172.24.", "172.25.",
    "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.",
    "192.168.",
)


@dataclass
class GeoData:
    """
    Geo + fraud signals from MaxMind.

    Geo fields (city, subdivision, postal_code, country_iso) are used for CAPI
    enrichment — each platform expects SHA-256-hashed lowercase values.

    Fraud fields are used for order-time risk scoring.
    """
    # ── Geo enrichment (CAPI) ────────────────────────────────────────────────
    country_iso: str | None = None          # "SA"
    city: str | None = None                 # "Riyadh"
    subdivision: str | None = None          # "Riyadh Province"
    subdivision_iso: str | None = None      # "01"
    postal_code: str | None = None          # "12271"
    latitude: float | None = None
    longitude: float | None = None
    accuracy_radius: int | None = None      # km

    # ── Fraud signals (from GeoIP2 Insights only) ────────────────────────────
    is_vpn: bool = False
    is_proxy: bool = False
    is_tor: bool = False
    is_hosting: bool = False
    risk_score: float | None = None

    # ── Lookup meta ──────────────────────────────────────────────────────────
    source: str = "none"        # "webservice" | "localdb" | "private_ip" | "disabled" | "error"
    error: str | None = None


@dataclass
class GeoIPResult:
    """Result of check_ip — always allowed; carries geo payload for persistence."""
    allowed: bool
    geo: GeoData = field(default_factory=GeoData)
    reason: str | None = None


# ── Web-service client (lazy singleton) ──────────────────────────────────────

_ws_client: geoip2.webservice.AsyncClient | None = None


def _get_ws_client() -> geoip2.webservice.AsyncClient:
    global _ws_client
    if _ws_client is None:
        _ws_client = geoip2.webservice.AsyncClient(
            account_id=settings.MAXMIND_ACCOUNT_ID,
            license_key=settings.MAXMIND_LICENSE_KEY,
        )
    return _ws_client


# ── Local DB reader (lazy singleton) ─────────────────────────────────────────

_db_reader = None


def _get_db_reader():
    global _db_reader
    if _db_reader is None:
        import geoip2.database
        _db_reader = geoip2.database.Reader(settings.MAXMIND_DB_PATH)
    return _db_reader


# ── Helper to extract GeoData from a geoip2 city/insights response ───────────

def _extract_geo(response) -> GeoData:
    loc = response.location
    city_obj = response.city
    sub_list = response.subdivisions
    sub = sub_list.most_specific if sub_list else None
    postal = response.postal

    geo = GeoData(
        country_iso=getattr(response.country, "iso_code", None),
        city=getattr(city_obj, "name", None),
        subdivision=getattr(sub, "name", None) if sub else None,
        subdivision_iso=getattr(sub, "iso_code", None) if sub else None,
        postal_code=getattr(postal, "code", None),
        latitude=getattr(loc, "latitude", None),
        longitude=getattr(loc, "longitude", None),
        accuracy_radius=getattr(loc, "accuracy_radius", None),
    )

    # Fraud fields — only present in Insights responses
    traits = getattr(response, "traits", None)
    if traits:
        geo.is_vpn = bool(getattr(traits, "is_anonymous_vpn", False))
        geo.is_proxy = bool(
            getattr(traits, "is_anonymous_proxy", False)
            or getattr(traits, "is_public_proxy", False)
        )
        geo.is_tor = bool(getattr(traits, "is_tor_exit_node", False))
        geo.is_hosting = bool(getattr(traits, "is_hosting_provider", False))

    risk = getattr(response, "risk_score", None)
    if risk is not None:
        geo.risk_score = float(risk)

    return geo


# ── Core lookup ───────────────────────────────────────────────────────────────

async def lookup(ip_address: str | None) -> GeoData:
    """
    Perform a MaxMind geo lookup for the given IP.

    Always returns a GeoData object. On any error, returns empty GeoData with
    source="error" — callers must not block orders based on lookup failures.
    """
    if not settings.MAXMIND_ENABLED:
        return GeoData(source="disabled")

    if not ip_address or any(ip_address.startswith(p) for p in _PRIVATE_PREFIXES):
        return GeoData(source="private_ip", country_iso="SA")  # assume SA for local/dev

    # ── Local DB mode ─────────────────────────────────────────────────────────
    if settings.MAXMIND_DB_PATH:
        try:
            import asyncio
            reader = _get_db_reader()
            # geoip2.database.Reader is sync — run in thread pool
            response = await asyncio.get_event_loop().run_in_executor(
                None, reader.city, ip_address
            )
            geo = _extract_geo(response)
            geo.source = "localdb"
            return geo
        except geoip2.errors.AddressNotFoundError:
            logger.debug("GeoIP local DB: IP %s not found", ip_address)
            return GeoData(source="error", error="ip_not_found")
        except Exception as exc:
            logger.exception("GeoIP local DB lookup error for %s", ip_address)
            return GeoData(source="error", error=str(exc))

    # ── Web service mode ─────────────────────────────────────────────────────
    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        logger.debug("MaxMind not configured — skipping geo lookup")
        return GeoData(source="disabled", error="no_credentials")

    try:
        client = _get_ws_client()
        # Use insights() for fraud signals; falls back to city() if not subscribed
        try:
            response = await client.insights(ip_address)
        except geoip2.errors.GeoIP2Error:
            response = await client.city(ip_address)
        geo = _extract_geo(response)
        geo.source = "webservice"
        return geo
    except geoip2.errors.AddressNotFoundError:
        logger.debug("GeoIP web service: IP %s not found", ip_address)
        return GeoData(source="error", error="ip_not_found")
    except Exception as exc:
        logger.exception("GeoIP web service lookup error for %s", ip_address)
        return GeoData(source="error", error=str(exc))


# ── Decision layer ────────────────────────────────────────────────────────────

async def check_ip(ip_address: str | None) -> GeoIPResult:
    """
    Geo enrichment for orders — always allows checkout.

    MaxMind flags (VPN, country, risk) are stored on the order for analytics only;
    they do not block visitors. Use lookup() via this wrapper for a stable GeoIPResult shape.
    """
    if not settings.MAXMIND_ENABLED:
        return GeoIPResult(allowed=True, geo=GeoData(source="disabled"), reason="geoip_disabled")

    geo = await lookup(ip_address)
    if geo.source == "error":
        return GeoIPResult(allowed=True, geo=geo, reason=f"lookup_error:{geo.error}")
    return GeoIPResult(allowed=True, geo=geo, reason="enrichment_only")


def is_phone_whitelisted(phone: str) -> bool:
    """Legacy list; order flow no longer uses GeoIP blocking."""
    normalized = phone.strip().replace(" ", "").replace("-", "")
    for wl_phone in settings.geoip_whitelisted_phones:
        wl = wl_phone.strip().replace(" ", "").replace("-", "")
        if normalized == wl or normalized.endswith(wl.lstrip("+")) or wl.endswith(normalized.lstrip("+")):
            return True
    return False
