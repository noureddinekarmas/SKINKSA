import hashlib


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def hash_phone_for_meta(digits: str) -> str:
    """digits = 9665XXXXXXXX"""
    return sha256_hex(digits.lower())


def hash_phone_for_snap(digits: str) -> str:
    """digits = 9665XXXXXXXX"""
    return sha256_hex(digits)


def hash_phone_for_tiktok(digits: str) -> str:
    """digits = 9665XXXXXXXX"""
    return sha256_hex(digits.lower())
