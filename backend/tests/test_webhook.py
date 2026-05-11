"""Tests for webhook service."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.webhooks.sheets import send_sheets_webhook


@pytest.mark.asyncio
async def test_webhook_skipped_when_no_url():
    """When ORDERS_WEBHOOK_URL is empty, should return skipped=True."""
    with patch("app.services.webhooks.sheets.settings") as mock_settings:
        mock_settings.ORDERS_WEBHOOK_URL = ""
        mock_settings.ORDERS_WEBHOOK_TIMEOUT_SECONDS = 10

        db = AsyncMock()
        result = await send_sheets_webhook(db, None, [])
        assert result["skipped"] is True
        assert "reason" in result


@pytest.mark.asyncio
async def test_webhook_posts_when_url_configured():
    """Sends POST with sheet_row when URL is set."""
    mock_order = MagicMock()
    mock_order.created_at = None
    mock_order.order_number = "SK-10001"
    mock_order.customer_name = "Test"
    mock_order.customer_phone_digits = "966501234567"
    mock_order.customer_address = "Riyadh"
    mock_order.source_url = "https://example.com/p"
    mock_order.currency = "SAR"
    mock_order.total_sar = MagicMock()
    mock_order.total_sar.__float__ = lambda self: 199.0
    mock_order.id = "00000000-0000-0000-0000-000000000001"
    mock_order.utm_source = None
    mock_order.utm_medium = None
    mock_order.utm_campaign = None
    mock_order.utm_term = None
    mock_order.utm_content = None
    mock_order.customer_province = "Riyadh"
    mock_order.geo_postal_code = None

    mock_item = MagicMock()
    mock_item.offer_id = None
    mock_item.upsell_offer_id = None
    mock_item.title_snapshot = "عنوان"
    mock_item.quantity = 1
    mock_item.id = "00000000-0000-0000-0000-000000000002"

    with patch("app.services.webhooks.sheets.settings") as mock_settings:
        mock_settings.ORDERS_WEBHOOK_URL = "https://example.com/exec"
        mock_settings.ORDERS_WEBHOOK_TIMEOUT_SECONDS = 10

        db = AsyncMock()
        db.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[])))))

        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.text = "ok"

        with patch("app.services.webhooks.sheets.httpx.AsyncClient") as client_cls:
            client = AsyncMock()
            client.__aenter__.return_value = client
            client.__aexit__.return_value = None
            client.post = AsyncMock(return_value=mock_resp)
            client_cls.return_value = client

            result = await send_sheets_webhook(db, mock_order, [mock_item])

        assert result.get("skipped") is not True
        assert result["status_code"] == 200
        call_kw = client.post.call_args
        assert call_kw[0][0] == "https://example.com/exec"
        payload = call_kw[1]["json"]
        assert payload["sheet_row"]["country"] == "KSA"
        assert payload["sheet_row"]["currency"] == "SAR"
        assert payload["sheet_row"]["phone"] == "966501234567"
        assert "nama-" in payload["sheet_row"]["notes"]
        assert len(payload["row"]) == 18
