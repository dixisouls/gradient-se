from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    DateTime,
    Enum,
    Float,
    TIMESTAMP,
    CheckConstraint,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import relationship
import enum

from app.database.db import Base


class UserRole(str, enum.Enum):
    """User role enum."""

    STUDENT = "student"
    PROFESSOR = "professor"
    ADMIN = "admin"


class CourseUserRole(str, enum.Enum):
    """Course user role enum."""

    STUDENT = "student"
    PROFESSOR = "professor"
    TEACHING_ASSISTANT = "teaching_assistant"


class AssignmentType(str, enum.Enum):
    """Assignment type enum."""

    ESSAY = "essay"
    CODE = "code"
    PRESENTATION = "presentation"
    QUIZ = "quiz"
    OTHER = "other"


class ContentType(str, enum.Enum):
    """Content type enum."""

    REFERENCE_SOLUTION = "reference_solution"
    RUBRIC = "rubric"
    SUPPLEMENTARY_MATERIAL = "supplementary_material"


class SubmissionStatus(str, enum.Enum):
    """Submission status enum."""

    SUBMITTED = "submitted"
    GRADED = "graded"
    ACCEPTED = "accepted"
    RESUBMITTED = "resubmitted"


class IssueType(str, enum.Enum):
    """Issue type enum."""

    GRAMMAR = "grammar"
    READABILITY = "readability"
    STRUCTURE = "structure"
    LOGIC = "logic"
    CONTENT = "content"


class SeverityLevel(str, enum.Enum):
    """Severity level enum."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class NotificationType(str, enum.Enum):
    """Notification type enum."""

    DEADLINE_REMINDER = "deadline_reminder"
    FEEDBACK_AVAILABLE = "feedback_available"
    GRADE_POSTED = "grade_posted"
    SYSTEM = "system"


class FeedbackLevel(str, enum.Enum):
    """Feedback level enum."""

    MINIMAL = "minimal"
    STANDARD = "standard"
    DETAILED = "detailed"


class User(Base):
    """User model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(
        String, nullable=False
    )  # Using string instead of Enum for compatibility
    phone_number = Column(String(20), nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    last_login = Column(TIMESTAMP(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    course_users = relationship(
        "CourseUser", back_populates="user", cascade="all, delete-orphan"
    )
    preferences = relationship(
        "UserPreference",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Course(Base):
    """Course model."""

    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    term = Column(String(50), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    course_users = relationship(
        "CourseUser", back_populates="course", cascade="all, delete-orphan"
    )
    assignments = relationship(
        "Assignment", back_populates="course", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("code", "term", name="unique_code_term"),)


class CourseUser(Base):
    """Course-User relationship model."""

    __tablename__ = "course_users"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    role = Column(
        String, nullable=False
    )  # Using string instead of Enum for compatibility
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    course = relationship("Course", back_populates="course_users")
    user = relationship("User", back_populates="course_users")

    __table_args__ = (
        UniqueConstraint("course_id", "user_id", name="unique_course_user"),
    )


class Assignment(Base):
    """Assignment model."""

    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    assignment_type = Column(
        String, nullable=False
    )  # Using string instead of Enum for compatibility
    due_date = Column(TIMESTAMP(timezone=True), nullable=False)
    points_possible = Column(Integer, nullable=False)
    allow_resubmissions = Column(Boolean, default=False)
    resubmission_deadline = Column(TIMESTAMP(timezone=True), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    course = relationship("Course", back_populates="assignments")
    creator = relationship("User")
    materials = relationship(
        "AssignmentMaterial", back_populates="assignment", cascade="all, delete-orphan"
    )
    submissions = relationship(
        "Submission", back_populates="assignment", cascade="all, delete-orphan"
    )
    rubrics = relationship(
        "Rubric", back_populates="assignment", cascade="all, delete-orphan"
    )
    reference_solution = Column(Text, nullable=True)
    reference_solution_file_path = Column(String(512), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "resubmission_deadline IS NULL OR resubmission_deadline > due_date",
            name="check_resubmission_after_due",
        ),
        CheckConstraint("points_possible > 0", name="check_positive_points"),
    )


class AssignmentMaterial(Base):
    """Assignment material model."""

    __tablename__ = "assignment_materials"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(
        Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False
    )
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_type = Column(String(50), nullable=False)
    content_type = Column(
        String, nullable=False
    )  # Using string instead of Enum for compatibility
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    assignment = relationship("Assignment", back_populates="materials")
    uploader = relationship("User")


class Submission(Base):
    """Submission model."""

    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(
        Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submission_time = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    is_late = Column(Boolean, default=False)
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(512), nullable=True)
    file_type = Column(String(50), nullable=True)
    submission_text = Column(Text, nullable=True)
    attempt_number = Column(Integer, default=1)
    status = Column(
        String, default="submitted"
    )  # Using string instead of Enum for compatibility
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User")
    feedback = relationship(
        "Feedback",
        back_populates="submission",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint(
            "file_path IS NOT NULL OR submission_text IS NOT NULL",
            name="check_file_or_text_required",
        ),
    )


class UserPreference(Base):
    """User preference model."""

    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    notification_deadline_hours = Column(Integer, default=24)
    email_notifications = Column(Boolean, default=True)
    in_app_notifications = Column(Boolean, default=True)
    feedback_level = Column(
        String, default="standard"
    )  # Using string instead of Enum for compatibility
    theme = Column(String(50), default="light")
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    user = relationship("User", back_populates="preferences")


class Feedback(Base):
    """Feedback model."""

    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(
        Integer, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False
    )
    feedback_text = Column(Text, nullable=True)
    grammar_score = Column(Float, nullable=True)
    readability_score = Column(Float, nullable=True)
    structure_score = Column(Float, nullable=True)
    logic_score = Column(Float, nullable=True)
    similarity_score = Column(Float, nullable=True)
    suggested_grade = Column(Float, nullable=True)
    final_grade = Column(Float, nullable=True)
    graded_by = Column(String(100), nullable=True)
    feedback_generated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    professor_review = Column(Boolean, default=False)
    professor_comments = Column(Text, nullable=True)
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    submission = relationship("Submission", back_populates="feedback")
    details = relationship(
        "FeedbackDetail", back_populates="feedback", cascade="all, delete-orphan"
    )


class FeedbackDetail(Base):
    """Feedback detail model."""

    __tablename__ = "feedback_details"

    id = Column(Integer, primary_key=True, index=True)
    feedback_id = Column(
        Integer, ForeignKey("feedback.id", ondelete="CASCADE"), nullable=False
    )
    issue_type = Column(
        String, nullable=False
    )  # Using string instead of Enum for compatibility
    issue_location = Column(String(255), nullable=True)
    issue_description = Column(Text, nullable=False)
    suggestion = Column(Text, nullable=True)
    severity = Column(
        String, nullable=False
    )  # Using string instead of Enum for compatibility
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    feedback = relationship("Feedback", back_populates="details")


class Rubric(Base):
    """Rubric model."""

    __tablename__ = "rubrics"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(
        Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    assignment = relationship("Assignment", back_populates="rubrics")
    creator = relationship("User")
    criteria = relationship(
        "RubricCriteria", back_populates="rubric", cascade="all, delete-orphan"
    )


class RubricCriteria(Base):
    """Rubric criteria model."""

    __tablename__ = "rubric_criteria"

    id = Column(Integer, primary_key=True, index=True)
    rubric_id = Column(
        Integer, ForeignKey("rubrics.id", ondelete="CASCADE"), nullable=False
    )
    criteria_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    points_possible = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    rubric = relationship("Rubric", back_populates="criteria")

    __table_args__ = (
        CheckConstraint("points_possible >= 0", name="check_non_negative_points"),
        CheckConstraint("weight >= 0 AND weight <= 1", name="check_weight_range"),
    )


class Notification(Base):
    """Notification model."""

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(
        String, nullable=False
    )  # Using string instead of Enum for compatibility
    related_assignment_id = Column(
        Integer, ForeignKey("assignments.id", ondelete="SET NULL"), nullable=True
    )
    is_read = Column(Boolean, default=False)
    scheduled_time = Column(TIMESTAMP(timezone=True), nullable=True)
    sent_time = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    user = relationship("User")
    related_assignment = relationship("Assignment")
