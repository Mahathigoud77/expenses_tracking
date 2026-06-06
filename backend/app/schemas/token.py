from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    role: str
    exp: int
    iat: Optional[int] = None


class UserResponse(BaseModel):
    user_id: int
    email: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    role: str


class LoginResponse(UserResponse):
    access_token: str
    token_type: str = "bearer"

