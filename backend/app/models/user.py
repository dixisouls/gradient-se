from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from enum import Enum
from datetime import datetime


class UserRole(str, Enum):
    """User role enum."""

    STUDENT = "student"
    PROFESSOR = "professor"
    ADMIN = "admin"


class UserBase(BaseModel):
    """Base user model."""

    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role: UserRole
    phone_number: Optional[str] = Field(None, max_length=20)


class UserCreate(UserBase):
    """User creation model."""

    password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)

    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        """Validate that passwords match."""
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v


class UserLogin(BaseModel):
    """User login model."""

    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update model."""

    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=20)


class UserResponse(UserBase):
    """User response model."""

    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        """Config for model."""

        from_attributes = True


class CourseSelection(BaseModel):
    """Course selection model."""

    course_ids: List[int] = Field(..., min_items=1, max_items=3)
