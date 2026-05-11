from app.services.geoip import GeoData
from app.services.traffic_validity import (
    is_valid_ksa_non_vpn_traffic,
    order_geo_valid_for_kpi,
)


def test_valid_sa_clean():
    geo = GeoData(country_iso="SA", is_vpn=False, is_proxy=False, is_tor=False)
    assert is_valid_ksa_non_vpn_traffic(geo, secondary_vpn=False) is True


def test_invalid_non_sa():
    geo = GeoData(country_iso="AE", is_vpn=False, is_proxy=False, is_tor=False)
    assert is_valid_ksa_non_vpn_traffic(geo, secondary_vpn=False) is False


def test_invalid_vpn():
    geo = GeoData(country_iso="SA", is_vpn=True, is_proxy=False, is_tor=False)
    assert is_valid_ksa_non_vpn_traffic(geo, secondary_vpn=False) is False


def test_invalid_secondary():
    geo = GeoData(country_iso="SA", is_vpn=False, is_proxy=False, is_tor=False)
    assert is_valid_ksa_non_vpn_traffic(geo, secondary_vpn=True) is False


def test_order_kpi_matches():
    assert order_geo_valid_for_kpi("SA", False, False, False, False) is True
    assert order_geo_valid_for_kpi("sa", False, False, False, False) is True
    assert order_geo_valid_for_kpi("SA", True, False, False, False) is False
    assert order_geo_valid_for_kpi("SA", False, False, False, True) is False
