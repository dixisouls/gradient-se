# backend/app/models/submission.py

from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class SubmissionStatus(str, Enum):
    """Submission status enum."""

    SUBMITTED = "submitted"
    GRADED = "graded"
    ACCEPTED = "accepted"
    RESUBMITTED = "resubmitted"


class GradingFeedback(BaseModel):
    """Grading feedback model."""

    overall_assessment: str
    improvement_suggestions: List[str]
    score: float
    similarity_score: Optional[float] = None
    professor_review: Optional[bool] = False


class SubmissionCreate(BaseModel):
    """Submission creation model."""

    assignment_id: int
    submission_text: Optional[str] = None
    # Note: file upload will be handled separately


class SubmissionResponse(BaseModel):
    """Submission response model."""

    id: int
    assignment_id: int
    assignment_title: Optional[str] = None
    user_id: int
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    submission_time: datetime
    is_late: bool
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    submission_text: Optional[str] = None
    attempt_number: int
    status: str
    feedback: Optional[GradingFeedback] = None

    class Config:
        """Config for the model."""

        from_attributes = True


class SubmissionGradingRequest(BaseModel):
    """Request model for manually grading a submission."""

    strictness: str = "Medium"  # Easy, Medium, or Strict


class SubmissionList(BaseModel):
    """Submission list model."""

    submissions: List[SubmissionResponse]
    total: int
