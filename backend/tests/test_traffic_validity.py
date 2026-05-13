from app.services.geoip import GeoData
from app.services.traffic_validity import (
    is_valid_ksa_non_vpn_traffic,
    order_geo_valid_for_kpi,
)


def test_all_traffic_counts_no_matter_geo_or_vpn():
    geo = GeoData(country_iso="AE", is_vpn=True, is_proxy=False, is_tor=False)
    assert is_valid_ksa_non_vpn_traffic(geo, secondary_vpn=True) is True


def test_order_kpi_counts_all():
    assert order_geo_valid_for_kpi("SA", False, False, False, False) is True
    assert order_geo_valid_for_kpi("US", True, True, True, True) is True
