"""Map UTM dimensions to a readable ad / platform label for admin reporting."""

from __future__ import annotations


def infer_ad_platform(utm_source: str, utm_medium: str) -> str:
    """
    Best-effort label for paid / social platforms. Uses utm_source + utm_medium text.
    Does not replace proper UTM hygiene — extend this list as you add channels.
    """
    s = f"{utm_source} {utm_medium}".lower().strip()
    src = (utm_source or "").lower()
    med = (utm_medium or "").lower()

    if src == "(direct)" or s in ("(direct) (none)", "(direct)"):
        return "Direct / organic"

    if "tiktok" in s or " ttclid" in s or s.startswith("tt ") or " tiktok" in s:
        return "TikTok Ads"
    if "snap" in s or "snapchat" in s:
        return "Snapchat Ads"
    if any(x in s for x in ("facebook", "instagram", " meta", "meta ", " fb", "fb ", "ig ", " ig")):
        return "Meta (Facebook / Instagram)"
    if "google" in s or "gads" in s or "adwords" in s or "dv360" in s:
        return "Google Ads"
    if "youtube" in s or "yt " in s or " youtu" in s:
        return "YouTube"
    if "twitter" in s or " x " in s or s.startswith("x ") or s.endswith(" x"):
        return "X (Twitter)"
    if "pinterest" in s:
        return "Pinterest Ads"
    if "linkedin" in s:
        return "LinkedIn Ads"
    if "taboola" in s or "outbrain" in s:
        return "Native / content syndication"
    if med in ("email", "newsletter") or "mail" in src:
        return "Email"
    if med in ("cpc", "ppc", "paid", "paid_social"):
        return "Paid (other)"

    return utm_source if utm_source and utm_source != "(direct)" else "Other / unattributed"