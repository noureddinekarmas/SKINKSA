"""Dashboard / analytics inclusion — all real visitors count (no VPN or country exclusions)."""

from __future__ import annotations

from app.services.geoip import GeoData


def is_valid_ksa_non_vpn_traffic(
    geo: GeoData,
    *,
    secondary_vpn: bool = False,
) -> bool:
    """
    Always True — geo/VPN flags are stored for reporting only, not to filter traffic.
    """
    return True


def order_geo_valid_for_kpi(
    geo_country: str | None,
    geo_is_vpn: bool,
    geo_is_proxy: bool,
    geo_is_tor: bool,
    geo_secondary_vpn: bool,
) -> bool:
    """All finalized orders count toward KPI geo slice (same as analytics)."""
    return True

