import re

KSA_MOBILE_PATTERN = re.compile(r"^(?:\+?966|0)?5\d{8}$")
QATAR_MOBILE_PATTERN = re.compile(r"^(?:\+?974)?[3567]\d{7}$")
KUWAIT_MOBILE_PATTERN = re.compile(r"^(?:\+?965)?[569]\d{7}$")


def _clean(phone: str) -> str:
    return re.sub(r"[\s\-()]", "", phone)


def is_valid_saudi_mobile(phone: str) -> bool:
    return bool(KSA_MOBILE_PATTERN.match(_clean(phone)))


def is_valid_qatar_mobile(phone: str) -> bool:
    return bool(QATAR_MOBILE_PATTERN.match(_clean(phone)))


def is_valid_kuwait_mobile(phone: str) -> bool:
    return bool(KUWAIT_MOBILE_PATTERN.match(_clean(phone)))


def is_valid_gcc_mobile(phone: str, currency: str) -> bool:
    c = (currency or "SAR").upper()
    if c == "SAR":
        return is_valid_saudi_mobile(phone)
    if c == "QAR":
        return is_valid_qatar_mobile(phone)
    if c == "KWD":
        return is_valid_kuwait_mobile(phone)
    return False


def normalize_saudi_mobile(phone: str) -> dict:
    cleaned = _clean(phone)
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


def normalize_qatar_mobile(phone: str) -> dict:
    cleaned = _clean(phone)
    if cleaned.startswith("+"):
        cleaned = cleaned[1:]
    if cleaned.startswith("974"):
        cleaned = cleaned[3:]
    national = cleaned
    digits = f"974{national}"
    return {"e164": f"+{digits}", "digits": digits}


def normalize_kuwait_mobile(phone: str) -> dict:
    cleaned = _clean(phone)
    if cleaned.startswith("+"):
        cleaned = cleaned[1:]
    if cleaned.startswith("965"):
        cleaned = cleaned[3:]
    national = cleaned
    digits = f"965{national}"
    return {"e164": f"+{digits}", "digits": digits}


def normalize_gcc_mobile(phone: str, currency: str) -> dict:
    c = (currency or "SAR").upper()
    if c == "SAR":
        return normalize_saudi_mobile(phone)
    if c == "QAR":
        return normalize_qatar_mobile(phone)
    if c == "KWD":
        return normalize_kuwait_mobile(phone)
    raise ValueError(f"unsupported_currency:{c}")
