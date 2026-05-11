import pytest

from app.services.phone import is_valid_saudi_mobile, normalize_saudi_mobile


@pytest.mark.parametrize(
    "phone,expected",
    [
        ("0512345678", True),
        ("512345678", True),
        ("+966512345678", True),
        ("966512345678", True),
        ("0612345678", False),
        ("123", False),
    ],
)
def test_is_valid_saudi_mobile(phone, expected):
    assert is_valid_saudi_mobile(phone) == expected


@pytest.mark.parametrize(
    "phone,e164,digits",
    [
        ("0512345678", "+966512345678", "966512345678"),
        ("512345678", "+966512345678", "966512345678"),
        ("+966512345678", "+966512345678", "966512345678"),
        ("966512345678", "+966512345678", "966512345678"),
    ],
)
def test_normalize_saudi_mobile(phone, e164, digits):
    result = normalize_saudi_mobile(phone)
    assert result["e164"] == e164
    assert result["digits"] == digits
