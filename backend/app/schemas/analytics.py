from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class AnalyticsEventIn(BaseModel):
    event_type: str = Field(..., max_length=50)
    path: Optional[str] = Field(None, max_length=500)
    product_slug: Optional[str] = Field(None, max_length=200)
    session_id: Optional[str] = Field(None, max_length=80)
    utm_source: Optional[str] = Field(None, max_length=200)
    utm_medium: Optional[str] = Field(None, max_length=200)
    utm_campaign: Optional[str] = Field(None, max_length=200)
