"""
SHA-256 hashing utilities for CAPI PII normalization.

Rules per platform:
  • Meta CAPI  — lowercase input, then SHA-256
  • TikTok     — lowercase input, then SHA-256
  • Snapchat   — lowercase input, then SHA-256

Geo fields (city, subdivision, postal_code, country) follow the same rule:
strip whitespace, lowercase, SHA-256.
"""

import hashlib


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


# ── Phone ─────────────────────────────────────────────────────────────────────

def hash_phone_for_meta(digits: str) -> str:
    """digits = 9665XXXXXXXX → lowercase SHA-256"""
    return sha256_hex(digits.lower())


def hash_phone_for_snap(digits: str) -> str:
    """digits = 9665XXXXXXXX → lowercase SHA-256"""
    return sha256_hex(digits.lower())


def hash_phone_for_tiktok(digits: str) -> str:
    """digits = 9665XXXXXXXX → lowercase SHA-256"""
    return sha256_hex(digits.lower())


# ── Geo enrichment ────────────────────────────────────────────────────────────

def _norm(value: str | None) -> str | None:
    """Strip, lowercase, return None if empty."""
    if not value:
        return None
    v = value.strip().lower()
    return v if v else None


def hash_geo_field(value: str | None) -> str | None:
    """Hash a single geo field (city / state / zip / country).
    Returns None if the value is empty so callers can skip absent fields.
    """
    normed = _norm(value)
    return sha256_hex(normed) if normed else None


def build_hashed_geo(
    city: str | None = None,
    subdivision: str | None = None,
    postal_code: str | None = None,
    country_iso: str | None = None,
) -> dict:
    """
    Return a dict of pre-hashed geo fields ready to merge into CAPI user_data.

    Keys follow Meta CAPI naming (ct / st / zp / country) which is also the
    convention used as a baseline for TikTok and Snapchat adapters.
    Only non-None values are included.
    """
    result: dict = {}
    if h := hash_geo_field(city):
        result["ct"] = [h]
    if h := hash_geo_field(subdivision):
        result["st"] = [h]
    if h := hash_geo_field(postal_code):
        result["zp"] = [h]
    if h := hash_geo_field(country_iso):
        result["country"] = [h]
    return result
