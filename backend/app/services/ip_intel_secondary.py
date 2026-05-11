"""
Optional second opinion for VPN / proxy detection (alongside MaxMind Insights).

Supports IPQualityScore when IPQUALITY_API_KEY is set. Fails open: any error
returns False (do not treat as VPN) so storefront traffic is not penalized by
API outages — analytics simply won't get the extra signal until the API works.
"""

from __future__ import annotations

import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

IPQUALITY_BASE = "https://ipqualityscore.com/api/json/ip"


async def lookup_secondary_vpn(ip_address: str | None) -> bool:
    """
    Return True if the secondary provider marks this IP as VPN/proxy.

    When no API key is configured, always returns False.
    """
    key = (settings.IPQUALITY_API_KEY or "").strip()
    if not key or not ip_address:
        return False

    url = f"{IPQUALITY_BASE}/{key}/{ip_address}"
    params = {"strictness": "1", "allow_public_access_points": "true"}

    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res = await client.get(url, params=params)
            res.raise_for_status()
            data = res.json()
    except Exception as exc:
        logger.debug("Secondary IP intel lookup failed for %s: %s", ip_address, exc)
        return False

    if not data.get("success", True):
        return False

    # IPQualityScore uses boolean flags; some fields may be missing.
    if data.get("vpn") is True or data.get("active_vpn") is True:
        return True
    if data.get("proxy") is True:
        return True
    if data.get("tor") is True:
        return True
    fraud_score = data.get("fraud_score")
    threshold = settings.IPQUALITY_VPN_FRAUD_SCORE_THRESHOLD
    if threshold > 0 and fraud_score is not None:
        try:
            if float(fraud_score) >= threshold:
                return True
        except (TypeError, ValueError):
            pass
    return False
