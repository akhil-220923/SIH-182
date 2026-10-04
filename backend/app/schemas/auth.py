from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from backend.app.models.user import UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    username: str
    full_name: str
    agency: str
    badge_number: Optional[str] = None
    role: UserRole
    is_active: bool

TokenResponse.model_rebuild()
