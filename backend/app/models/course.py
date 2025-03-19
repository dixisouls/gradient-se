from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class CourseBase(BaseModel):
    """Base course model."""

    code: str = Field(..., min_length=2, max_length=20)
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    term: str = Field(..., min_length=3, max_length=50)


class CourseCreate(CourseBase):
    """Course creation model."""

    pass


class CourseUpdate(BaseModel):
    """Course update model."""

    name: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    term: Optional[str] = Field(None, min_length=3, max_length=50)


class CourseResponse(CourseBase):
    """Course response model."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        """Config for model."""

        from_attributes = True


class CourseList(BaseModel):
    """Course list model."""

    courses: List[CourseResponse]
    total: int
