from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    """Token model."""

    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    """Token payload model."""

    sub: Optional[str] = None
    role: Optional[str] = None
