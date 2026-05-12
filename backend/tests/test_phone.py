import pytest

from app.services.phone import (
    is_valid_gcc_mobile,
    is_valid_kuwait_mobile,
    is_valid_qatar_mobile,
    is_valid_saudi_mobile,
    normalize_gcc_mobile,
    normalize_kuwait_mobile,
    normalize_qatar_mobile,
    normalize_saudi_mobile,
)


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
    "phone,expected",
    [
        ("31234567", True),
        ("33123456", True),
        ("+97433123456", True),
        ("97433123456", True),
        ("21234567", False),
    ],
)
def test_is_valid_qatar_mobile(phone, expected):
    assert is_valid_qatar_mobile(phone) == expected


@pytest.mark.parametrize(
    "phone,expected",
    [
        ("51234567", True),
        ("61234567", True),
        ("91234567", True),
        ("+96551234567", True),
        ("96551234567", True),
        ("41234567", False),
    ],
)
def test_is_valid_kuwait_mobile(phone, expected):
    assert is_valid_kuwait_mobile(phone) == expected


def test_is_valid_gcc_mobile_dispatches_currency():
    assert is_valid_gcc_mobile("0512345678", "SAR") is True
    assert is_valid_gcc_mobile("31234567", "QAR") is True
    assert is_valid_gcc_mobile("51234567", "KWD") is True
    assert is_valid_gcc_mobile("31234567", "SAR") is False


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


def test_normalize_qatar_mobile():
    r = normalize_qatar_mobile("+97433123456")
    assert r["e164"] == "+97433123456"
    assert r["digits"] == "97433123456"


def test_normalize_kuwait_mobile():
    r = normalize_kuwait_mobile("51234567")
    assert r["e164"] == "+96551234567"
    assert r["digits"] == "96551234567"


def test_normalize_gcc_mobile():
    assert normalize_gcc_mobile("0512345678", "SAR")["digits"].startswith("966")
    assert normalize_gcc_mobile("33123456", "QAR")["digits"].startswith("974")
    assert normalize_gcc_mobile("51234567", "KWD")["digits"].startswith("965")
