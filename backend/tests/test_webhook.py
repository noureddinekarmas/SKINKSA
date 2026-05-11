"""Tests for webhook service."""

from unittest.mock import patch

import pytest

from app.services.webhooks.sheets import send_sheets_webhook


@pytest.mark.asyncio
async def test_webhook_skipped_when_no_url():
    """When ORDERS_WEBHOOK_URL is empty, should return skipped=True."""
    with patch("app.services.webhooks.sheets.settings") as mock_settings:
        mock_settings.ORDERS_WEBHOOK_URL = ""
        mock_settings.ORDERS_WEBHOOK_TOKEN = ""
        mock_settings.ORDERS_WEBHOOK_TIMEOUT_SECONDS = 10

        result = await send_sheets_webhook(None, [], [])
        assert result["skipped"] is True
        assert "reason" in result


@pytest.mark.asyncio
async def test_webhook_skipped_when_no_token():
    """When ORDERS_WEBHOOK_TOKEN is empty, should return skipped=True."""
    with patch("app.services.webhooks.sheets.settings") as mock_settings:
        mock_settings.ORDERS_WEBHOOK_URL = "https://example.com/webhook"
        mock_settings.ORDERS_WEBHOOK_TOKEN = ""
        mock_settings.ORDERS_WEBHOOK_TIMEOUT_SECONDS = 10

        result = await send_sheets_webhook(None, [], [])
        assert result["skipped"] is True
