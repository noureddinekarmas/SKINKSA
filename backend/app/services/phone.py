import re

KSA_MOBILE_PATTERN = re.compile(r"^(?:\+?966|0)?5\d{8}$")


def is_valid_saudi_mobile(phone: str) -> bool:
    cleaned = re.sub(r"[\s\-()]", "", phone)
    return bool(KSA_MOBILE_PATTERN.match(cleaned))


def normalize_saudi_mobile(phone: str) -> dict:
    cleaned = re.sub(r"[\s\-()]", "", phone)
    if cleaned.startswith("+"):
        cleaned = cleaned[1:]
    if cleaned.startswith("966"):
        cleaned = cleaned[3:]
    elif cleaned.startswith("0"):
        cleaned = cleaned[1:]
    national = cleaned
    digits = f"966{national}"
    e164 = f"+{digits}"
    return {"e164": e164, "digits": digits}
