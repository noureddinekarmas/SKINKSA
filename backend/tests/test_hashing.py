from app.services.hashing import hash_phone_for_meta, sha256_hex


def test_sha256_hex():
    result = sha256_hex("966512345678")
    assert len(result) == 64
    assert result.islower()


def test_hash_phone_for_meta():
    result = hash_phone_for_meta("966512345678")
    assert len(result) == 64


def test_sha256_hex_deterministic():
    assert sha256_hex("test") == sha256_hex("test")


def test_hash_phone_for_meta_lowercases():
    upper_result = hash_phone_for_meta("966512345678")
    lower_result = hash_phone_for_meta("966512345678")
    assert upper_result == lower_result
