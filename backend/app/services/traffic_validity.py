"""Rules for counting store analytics and dashboard metrics (KSA, non-VPN)."""

from __future__ import annotations

from app.services.geoip import GeoData


def is_valid_ksa_non_vpn_traffic(
    geo: GeoData,
    *,
    secondary_vpn: bool = False,
) -> bool:
    """
    True when traffic should count toward dashboard metrics.

    Requires Saudi Arabia by MaxMind country ISO and no VPN/proxy/Tor signals
    from MaxMind, plus no positive VPN signal from the secondary provider.
    """
    if secondary_vpn:
        return False
    country = (geo.country_iso or "").upper()
    if country != "SA":
        return False
    if geo.is_vpn or geo.is_proxy or geo.is_tor:
        return False
    return True


def order_geo_valid_for_kpi(
    geo_country: str | None,
    geo_is_vpn: bool,
    geo_is_proxy: bool,
    geo_is_tor: bool,
    geo_secondary_vpn: bool,
) -> bool:
    """Same rules as analytics, using persisted order geo columns."""
    if geo_secondary_vpn:
        return False
    country = (geo_country or "").upper()
    if country != "SA":
        return False
    if geo_is_vpn or geo_is_proxy or geo_is_tor:
        return False
    return True

