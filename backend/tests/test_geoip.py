"""Tests for MaxMind GeoIP service — all run with MAXMIND_ENABLED=False (no network)."""

import pytest
from unittest.mock import patch, AsyncMock

from app.services.geoip import GeoData, lookup, check_ip


# ── lookup() ──────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_lookup_disabled_returns_disabled():
    with patch("app.services.geoip.settings") as mock:
        mock.MAXMIND_ENABLED = False
        geo = await lookup("1.2.3.4")
    assert geo.source == "disabled"
    assert geo.country_iso is None


@pytest.mark.asyncio
async def test_lookup_private_ip_returns_sa():
    with patch("app.services.geoip.settings") as mock:
        mock.MAXMIND_ENABLED = True
        mock.MAXMIND_DB_PATH = ""
        mock.MAXMIND_ACCOUNT_ID = 0
        mock.MAXMIND_LICENSE_KEY = ""
        geo = await lookup("127.0.0.1")
    assert geo.source == "private_ip"
    assert geo.country_iso == "SA"


@pytest.mark.asyncio
async def test_lookup_private_192_returns_sa():
    with patch("app.services.geoip.settings") as mock:
        mock.MAXMIND_ENABLED = True
        mock.MAXMIND_DB_PATH = ""
        mock.MAXMIND_ACCOUNT_ID = 0
        mock.MAXMIND_LICENSE_KEY = ""
        geo = await lookup("192.168.1.1")
    assert geo.source == "private_ip"
    assert geo.country_iso == "SA"


@pytest.mark.asyncio
async def test_lookup_no_credentials_returns_disabled():
    with patch("app.services.geoip.settings") as mock:
        mock.MAXMIND_ENABLED = True
        mock.MAXMIND_DB_PATH = ""
        mock.MAXMIND_ACCOUNT_ID = 0
        mock.MAXMIND_LICENSE_KEY = ""
        geo = await lookup("8.8.8.8")
    assert geo.source == "disabled"


# ── check_ip() ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_check_ip_disabled_always_allows():
    with patch("app.services.geoip.settings") as mock:
        mock.MAXMIND_ENABLED = False
    result = await check_ip("1.2.3.4")
    assert result.allowed is True
    assert result.reason == "geoip_disabled"


@pytest.mark.asyncio
async def test_check_ip_always_allows_with_geo():
    geo = GeoData(country_iso="US", is_vpn=True, risk_score=99.0, source="webservice")
    with patch("app.services.geoip.lookup", new=AsyncMock(return_value=geo)), patch(
        "app.services.geoip.settings"
    ) as mock:
        mock.MAXMIND_ENABLED = True
        result = await check_ip("1.2.3.4")
    assert result.allowed is True
    assert result.geo.country_iso == "US"
    assert result.reason == "enrichment_only"


@pytest.mark.asyncio
async def test_check_ip_fail_open_on_error():
    """Lookup errors must never block orders (fail-open)."""
    geo = GeoData(source="error", error="timeout")
    with patch("app.services.geoip.lookup", new=AsyncMock(return_value=geo)), \
         patch("app.services.geoip.settings") as mock:
        mock.MAXMIND_ENABLED = True
        result = await check_ip("1.2.3.4")
    assert result.allowed is True
    assert "lookup_error" in (result.reason or "")
