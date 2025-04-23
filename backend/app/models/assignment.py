# backend/app/models/assignment.py

from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime


class AssignmentBase(BaseModel):
    """Base assignment model."""

    title: str
    description: Optional[str] = None
    assignment_type: str
    due_date: datetime
    points_possible: int
    allow_resubmissions: bool = False
    resubmission_deadline: Optional[datetime] = None
    reference_solution: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    """Assignment creation model."""

    course_id: int
    created_by: Optional[int] = None


class AssignmentUpdate(BaseModel):
    """Assignment update model."""

    title: Optional[str] = None
    description: Optional[str] = None
    assignment_type: Optional[str] = None
    due_date: Optional[datetime] = None
    points_possible: Optional[int] = None
    allow_resubmissions: Optional[bool] = None
    resubmission_deadline: Optional[datetime] = None
    reference_solution: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    """Assignment response model."""

    id: int
    course_id: int
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        """Config for the model."""

        from_attributes = True


class AssignmentList(BaseModel):
    """Assignment list model."""

    assignments: List[AssignmentResponse]
    total: int
