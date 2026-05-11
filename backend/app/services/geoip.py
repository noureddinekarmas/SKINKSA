import logging
from dataclasses import dataclass

import geoip2.webservice

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: geoip2.webservice.AsyncClient | None = None


def _get_client() -> geoip2.webservice.AsyncClient:
    global _client
    if _client is None:
        _client = geoip2.webservice.AsyncClient(
            account_id=settings.MAXMIND_ACCOUNT_ID,
            license_key=settings.MAXMIND_LICENSE_KEY,
        )
    return _client


@dataclass
class GeoIPResult:
    allowed: bool
    country_iso: str | None = None
    is_vpn: bool = False
    is_proxy: bool = False
    is_tor: bool = False
    is_hosting: bool = False
    risk_score: float | None = None
    reason: str | None = None


_PRIVATE_PREFIXES = ("10.", "172.16.", "172.17.", "172.18.", "172.19.",
                     "172.20.", "172.21.", "172.22.", "172.23.", "172.24.",
                     "172.25.", "172.26.", "172.27.", "172.28.", "172.29.",
                     "172.30.", "172.31.", "192.168.", "127.", "::1")


async def check_ip(ip_address: str | None) -> GeoIPResult:
    """Check an IP address against MaxMind GeoIP2 Insights.

    Returns a GeoIPResult indicating whether the order should be allowed.
    """
    if not settings.MAXMIND_ENABLED:
        return GeoIPResult(allowed=True, reason="geoip_disabled")

    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        logger.warning("MaxMind credentials not configured — skipping GeoIP check")
        return GeoIPResult(allowed=True, reason="no_credentials")

    if not ip_address:
        logger.warning("No IP address provided — blocking order")
        return GeoIPResult(allowed=False, reason="no_ip")

    if any(ip_address.startswith(p) for p in _PRIVATE_PREFIXES):
        logger.info("Private/local IP %s — allowing (dev/testing)", ip_address)
        return GeoIPResult(allowed=True, country_iso=None, reason="private_ip")

    try:
        client = _get_client()
        response = await client.insights(ip_address)

        country_iso = response.country.iso_code
        traits = response.traits

        is_vpn = getattr(traits, "is_anonymous_vpn", False) or False
        is_proxy = getattr(traits, "is_anonymous_proxy", False) or getattr(traits, "is_public_proxy", False) or False
        is_tor = getattr(traits, "is_tor_exit_node", False) or False
        is_hosting = getattr(traits, "is_hosting_provider", False) or False
        risk_score = getattr(response, "risk_score", None)

        result = GeoIPResult(
            allowed=True,
            country_iso=country_iso,
            is_vpn=is_vpn,
            is_proxy=is_proxy,
            is_tor=is_tor,
            is_hosting=is_hosting,
            risk_score=risk_score,
        )

        if country_iso and country_iso.upper() != settings.GEOIP_ALLOWED_COUNTRY:
            result.allowed = False
            result.reason = f"country_blocked:{country_iso}"
            logger.info("Blocked order from country %s (IP: %s)", country_iso, ip_address)
            return result

        if is_vpn or is_proxy or is_tor:
            result.allowed = False
            flags = []
            if is_vpn:
                flags.append("vpn")
            if is_proxy:
                flags.append("proxy")
            if is_tor:
                flags.append("tor")
            result.reason = f"suspicious:{','.join(flags)}"
            logger.info("Blocked suspicious IP %s — flags: %s", ip_address, flags)
            return result

        if is_hosting:
            result.allowed = False
            result.reason = "hosting_provider"
            logger.info("Blocked hosting/datacenter IP %s", ip_address)
            return result

        if risk_score is not None and risk_score > 50:
            result.allowed = False
            result.reason = f"high_risk:{risk_score}"
            logger.info("Blocked high-risk IP %s (score: %s)", ip_address, risk_score)
            return result

        result.reason = "allowed"
        return result

    except geoip2.errors.AddressNotFoundError:
        logger.warning("IP %s not found in MaxMind — blocking", ip_address)
        return GeoIPResult(allowed=False, reason="ip_not_found")
    except Exception:
        logger.exception("MaxMind GeoIP lookup failed for %s — allowing (fail-open)", ip_address)
        return GeoIPResult(allowed=True, reason="lookup_error")


def is_phone_whitelisted(phone: str) -> bool:
    """Check if a phone number is in the whitelist (bypasses GeoIP)."""
    normalized = phone.strip().replace(" ", "").replace("-", "")
    for wl_phone in settings.GEOIP_WHITELISTED_PHONES:
        wl_normalized = wl_phone.strip().replace(" ", "").replace("-", "")
        if normalized == wl_normalized or normalized.endswith(wl_normalized):
            return True
    return False
