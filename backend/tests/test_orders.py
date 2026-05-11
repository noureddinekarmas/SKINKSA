"""Unit tests for order total calculation logic."""

from decimal import Decimal


def compute_order_total(offer_price: Decimal, upsell_price: Decimal | None = None) -> dict:
    subtotal = offer_price
    upsell = upsell_price or Decimal("0")
    total = subtotal + upsell
    return {"subtotal": subtotal, "upsell": upsell, "total": total}


def test_offer2_with_upsell():
    result = compute_order_total(Decimal("159"), Decimal("99"))
    assert result["subtotal"] == Decimal("159")
    assert result["upsell"] == Decimal("99")
    assert result["total"] == Decimal("258")


def test_offer1_no_upsell():
    result = compute_order_total(Decimal("129"))
    assert result["subtotal"] == Decimal("129")
    assert result["upsell"] == Decimal("0")
    assert result["total"] == Decimal("129")


def test_offer3_with_upsell():
    result = compute_order_total(Decimal("199"), Decimal("99"))
    assert result["total"] == Decimal("298")


def test_offer2_no_upsell():
    result = compute_order_total(Decimal("159"))
    assert result["total"] == Decimal("159")
