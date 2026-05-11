from fastapi import Header, HTTPException, status

from app.core.config import settings


async def internal_api_key_required(x_internal_api_key: str = Header(...)) -> None:
    if x_internal_api_key != settings.INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid internal API key",
        )
