from typing import Any, List, Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    BackgroundTasks,
    status,
)
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from app.api.dependencies import get_db
from app.core.auth import get_current_active_user
from app.database.models import (
    User,
    Assignment,
    Submission,
    Feedback,
    FeedbackDetail,
    IssueType,
    SeverityLevel,
    CourseUser,
)
from app.models.submission import (
    SubmissionCreate,
    SubmissionResponse,
    SubmissionList,
    SubmissionGradingRequest,
    GradingFeedback,
)
from app.services.gemini_service import GeminiService
import os
import shutil
from datetime import datetime, timezone

router = APIRouter()
gemini_service = GeminiService()


# File utilities
def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    """Save an uploaded file to the specified destination."""
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(destination), exist_ok=True)

        with open(destination, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)

        return destination
    finally:
        upload_file.file.close()


def read_file_content(file_path: str) -> str:
    """Read file content as text."""
    with open(file_path, "r") as f:
        return f.read()


def process_submission_grading(
    db: Session, submission_id: int, strictness: str = "Medium"
) -> None:
    """
    Process submission grading using Gemini API.
    This is designed to run as a background task.
    """
    # Get submission
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        print(f"Submission {submission_id} not found")
        return

    # Get assignment
    assignment = (
        db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    )
    if not assignment:
        print(f"Assignment {submission.assignment_id} not found")
        return

    # Get submission text
    submission_text = ""
    if submission.submission_text:
        submission_text = submission.submission_text
    elif submission.file_path:
        try:
            submission_text = read_file_content(submission.file_path)
        except Exception as e:
            print(f"Error reading submission file: {e}")
            return

    # Get reference solution
    reference_solution = None
    if assignment.reference_solution:
        reference_solution = assignment.reference_solution
    elif assignment.reference_solution_file_path:
        try:
            reference_solution = read_file_content(
                assignment.reference_solution_file_path
            )
        except Exception as e:
            print(f"Error reading reference solution file: {e}")

    # Grade submission
    try:
        feedback = gemini_service.grade_submission(
            student_submission=submission_text,
            reference_solution=reference_solution,
            total_points=assignment.points_possible,
            strictness=strictness,
        )

        # Create feedback in database
        db_feedback = Feedback(
            submission_id=submission.id,
            feedback_text=feedback.get("overall_assessment", ""),
            suggested_grade=feedback.get("score", 0),
            similarity_score=feedback.get("similarity_score"),
            graded_by="GRADiEnt AI",
            feedback_generated_at=func.now(),
        )
        db.add(db_feedback)
        db.flush()  # Get the ID without committing

        # Add feedback details with direct SQL using fixed enum values
        for i, suggestion in enumerate(feedback.get("improvement_suggestions", [])):
            # Using direct SQL with literal type casting
            stmt = text(
                """
                INSERT INTO feedback_details 
                (feedback_id, issue_type, issue_location, issue_description, suggestion, severity)
                VALUES 
                (:feedback_id, 'content'::issue_type, :issue_location, :issue_description, :suggestion, 'medium'::severity_level)
            """
            )

            db.execute(
                stmt,
                {
                    "feedback_id": db_feedback.id,
                    "issue_description": suggestion,
                    "suggestion": None,
                    "issue_location": None,
                },
            )

        # Update submission status
        submission.status = "graded"
        db.add(submission)

        db.commit()
    except Exception as e:
        print(f"Error during grading: {e}")
        db.rollback()


@router.post("/{submission_id}/accept", response_model=SubmissionResponse)
def accept_submission_grade(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Accept the AI-generated grade for a submission.

    Only professors who teach the course can accept grades.
    """
    # Check permission (only professors can accept grades)
    if current_user.role not in ["professor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professors can accept grades",
        )

    # Get submission
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found"
        )

    # Get the assignment to check the course
    assignment = (
        db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    )
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated assignment not found",
        )

    # For professors, check if they teach the course
    if current_user.role == "professor":
        # Check if professor teaches this course
        professor_course = (
            db.query(CourseUser)
            .filter(
                CourseUser.user_id == current_user.id,
                CourseUser.course_id == assignment.course_id,
                CourseUser.role == "professor",
            )
            .first()
        )

        if not professor_course:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to accept grades for this course",
            )

    # Update submission status to accepted
    submission.status = "accepted"
    db.add(submission)

    # Update feedback with professor_review flag
    feedback = (
        db.query(Feedback).filter(Feedback.submission_id == submission.id).first()
    )
    if feedback:
        feedback.professor_review = True
        db.add(feedback)

    db.commit()
    db.refresh(submission)

    # Get assignment title
    assignment_title = assignment.title if assignment else None

    # Get student info if professor
    student_name = None
    student_email = None
    if current_user.role in ["professor", "admin"]:
        student = db.query(User).filter(User.id == submission.user_id).first()
        if student:
            student_name = f"{student.first_name} {student.last_name}"
            student_email = student.email

    # Create response with properly formatted fields
    response = {
        "id": submission.id,
        "assignment_id": submission.assignment_id,
        "assignment_title": assignment_title,
        "user_id": submission.user_id,
        "student_name": student_name,
        "student_email": student_email,
        "submission_time": submission.submission_time,
        "is_late": submission.is_late,
        "file_name": submission.file_name,
        "file_path": submission.file_path,
        "file_type": submission.file_type,
        "submission_text": submission.submission_text,
        "attempt_number": submission.attempt_number,
        "status": submission.status,
    }

    # Include feedback in response
    if feedback:
        # Get feedback details
        details = (
            db.query(FeedbackDetail)
            .filter(FeedbackDetail.feedback_id == feedback.id)
            .all()
        )

        # Create GradingFeedback object
        feedback_response = {
            "overall_assessment": feedback.feedback_text or "",
            "improvement_suggestions": [detail.issue_description for detail in details],
            "score": feedback.suggested_grade or 0,
            "similarity_score": feedback.similarity_score,
            "professor_review": feedback.professor_review,
        }

        response["feedback"] = feedback_response
    else:
        response["feedback"] = None

    return response


@router.post(
    "/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED
)
async def create_submission(
    background_tasks: BackgroundTasks,
    assignment_id: int = Form(...),
    submission_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new submission.

    Students can only submit assignments for courses they are enrolled in.
    """
    # Validate assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )

    # Check if student is enrolled in the course (only for students)
    if current_user.role == "student":
        # Get course enrollment
        enrollment = (
            db.query(CourseUser)
            .filter(
                CourseUser.user_id == current_user.id,
                CourseUser.course_id == assignment.course_id,
            )
            .first()
        )

        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only submit assignments for courses you are enrolled in",
            )

    # Check if file or text is provided
    if not file and not submission_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either file or submission text must be provided",
        )

    # Handle file upload
    file_name = None
    file_path = None
    file_type = None

    if file:
        # Create directory if it doesn't exist
        os.makedirs("uploads/submissions", exist_ok=True)

        # Generate unique file name
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        file_name = f"{current_user.id}_{assignment_id}_{timestamp}_{file.filename}"
        file_path = f"uploads/submissions/{file_name}"

        # Save file
        save_upload_file(file, file_path)

        # Get file extension
        file_type = file.filename.split(".")[-1] if "." in file.filename else ""

    # Check if submission is late
    is_late = False
    now = datetime.now(timezone.utc)  # Make sure current time is timezone-aware
    if assignment.due_date:
        # Make sure we're comparing timezone-aware datetimes
        if assignment.due_date.tzinfo is None:
            # If due_date is naive, consider it as UTC
            due_date = assignment.due_date.replace(tzinfo=timezone.utc)
        else:
            due_date = assignment.due_date

        if now > due_date:
            is_late = True

    # Get attempt number
    attempt_count = (
        db.query(Submission)
        .filter(
            Submission.assignment_id == assignment_id,
            Submission.user_id == current_user.id,
        )
        .count()
    )

    # Create submission
    submission = Submission(
        assignment_id=assignment_id,
        user_id=current_user.id,
        submission_time=func.now(),  # This will be timezone-aware in the database
        is_late=is_late,
        file_name=file_name,
        file_path=file_path,
        file_type=file_type,
        submission_text=submission_text,
        attempt_number=attempt_count + 1,
        status="submitted",
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Add grading task to background tasks
    background_tasks.add_task(
        process_submission_grading, db=db, submission_id=submission.id
    )

    # Get assignment title for response
    assignment_title = assignment.title if assignment else None

    # Create response with properly formatted fields
    response = {
        "id": submission.id,
        "assignment_id": submission.assignment_id,
        "assignment_title": assignment_title,
        "user_id": submission.user_id,
        "submission_time": submission.submission_time,
        "is_late": submission.is_late,
        "file_name": submission.file_name,
        "file_path": submission.file_path,
        "file_type": submission.file_type,
        "submission_text": submission.submission_text,
        "attempt_number": submission.attempt_number,
        "status": submission.status,
        "feedback": None,  # No feedback yet since it's being processed
    }

    return response


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a submission by ID.

    Students can only access their own submissions.
    Professors can only access submissions for courses they teach.
    """
    # Get submission
    submission = db.query(Submission).filter(Submission.id == submission_id).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found"
        )

    # Get assignment to check course
    assignment = (
        db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    )
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated assignment not found",
        )

    # Check permission based on role
    if current_user.role == "student":
        # Students can only view their own submissions
        if submission.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this submission",
            )
    elif current_user.role == "professor":
        # Professors can only view submissions for courses they teach
        professor_course = (
            db.query(CourseUser)
            .filter(
                CourseUser.user_id == current_user.id,
                CourseUser.course_id == assignment.course_id,
                CourseUser.role == "professor",
            )
            .first()
        )

        if not professor_course:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access submissions for this course",
            )

    # Get assignment title
    assignment_title = assignment.title if assignment else None

    # Get student info if professor
    student_name = None
    student_email = None
    if current_user.role in ["professor", "admin"]:
        student = db.query(User).filter(User.id == submission.user_id).first()
        if student:
            student_name = f"{student.first_name} {student.last_name}"
            student_email = student.email

    # Create response object
    response = {
        "id": submission.id,
        "assignment_id": submission.assignment_id,
        "assignment_title": assignment_title,
        "user_id": submission.user_id,
        "student_name": student_name,
        "student_email": student_email,
        "submission_time": submission.submission_time,
        "is_late": submission.is_late,
        "file_name": submission.file_name,
        "file_path": submission.file_path,
        "file_type": submission.file_type,
        "submission_text": submission.submission_text,
        "attempt_number": submission.attempt_number,
        "status": submission.status,
    }

    # Get feedback
    feedback = (
        db.query(Feedback).filter(Feedback.submission_id == submission.id).first()
    )

    if feedback:
        # Get feedback details
        details = (
            db.query(FeedbackDetail)
            .filter(FeedbackDetail.feedback_id == feedback.id)
            .all()
        )

        # Create GradingFeedback object
        feedback_response = {
            "overall_assessment": feedback.feedback_text or "",
            "improvement_suggestions": [detail.issue_description for detail in details],
            "score": feedback.suggested_grade or 0,
            "similarity_score": feedback.similarity_score,
            "professor_review": feedback.professor_review,
        }

        response["feedback"] = feedback_response
    else:
        response["feedback"] = None

    return response


@router.get("/", response_model=SubmissionList)
def get_submissions(
    assignment_id: Optional[int] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get submissions, filtered by assignment and/or user.

    Students can only see their own submissions.
    Professors can only see submissions for courses they teach.
    """
    # Build query
    query = db.query(Submission)

    # Apply filters
    if assignment_id:
        query = query.filter(Submission.assignment_id == assignment_id)

    if user_id:
        # If specific user_id is requested, check permissions
        if current_user.role == "student" and user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Students can only view their own submissions",
            )
        query = query.filter(Submission.user_id == user_id)
    else:
        # If no specific user requested, limit to current user if student
        if current_user.role == "student":
            query = query.filter(Submission.user_id == current_user.id)

    # For professors, filter by courses they teach
    if current_user.role == "professor":
        # Get courses the professor teaches
        taught_course_ids = (
            db.query(CourseUser.course_id)
            .filter(
                CourseUser.user_id == current_user.id, CourseUser.role == "professor"
            )
            .all()
        )

        # Extract course IDs
        taught_course_ids = [course_id for (course_id,) in taught_course_ids]

        # Join with assignments to filter by course_id
        query = query.join(
            Assignment, Submission.assignment_id == Assignment.id
        ).filter(Assignment.course_id.in_(taught_course_ids))

    # Execute query
    submissions = query.all()

    # Process submissions to include feedback in correct format
    response_submissions = []
    for submission in submissions:
        # Get assignment title if available
        assignment = (
            db.query(Assignment)
            .filter(Assignment.id == submission.assignment_id)
            .first()
        )
        assignment_title = assignment.title if assignment else None

        # Get student info if professor
        student_name = None
        student_email = None
        if current_user.role in ["professor", "admin"]:
            student = db.query(User).filter(User.id == submission.user_id).first()
            if student:
                student_name = f"{student.first_name} {student.last_name}"
                student_email = student.email

        # Create response object
        submission_response = {
            "id": submission.id,
            "assignment_id": submission.assignment_id,
            "assignment_title": assignment_title,
            "user_id": submission.user_id,
            "student_name": student_name,
            "student_email": student_email,
            "submission_time": submission.submission_time,
            "is_late": submission.is_late,
            "file_name": submission.file_name,
            "file_path": submission.file_path,
            "file_type": submission.file_type,
            "submission_text": submission.submission_text,
            "attempt_number": submission.attempt_number,
            "status": submission.status,
        }

        # Get feedback if available
        feedback = (
            db.query(Feedback).filter(Feedback.submission_id == submission.id).first()
        )
        if feedback:
            # Get feedback details
            details = (
                db.query(FeedbackDetail)
                .filter(FeedbackDetail.feedback_id == feedback.id)
                .all()
            )

            # Create GradingFeedback object with required fields
            feedback_response = {
                "overall_assessment": feedback.feedback_text
                or "",  # Use feedback_text for overall_assessment
                "improvement_suggestions": [
                    detail.issue_description for detail in details
                ],
                "score": feedback.suggested_grade or 0,  # Use suggested_grade for score
                "similarity_score": feedback.similarity_score,
                "professor_review": feedback.professor_review,
            }

            submission_response["feedback"] = feedback_response
        else:
            submission_response["feedback"] = None

        response_submissions.append(submission_response)

    # Return formatted response
    return {"submissions": response_submissions, "total": len(response_submissions)}


@router.post("/{submission_id}/grade", response_model=SubmissionResponse)
def grade_submission_manually(
    submission_id: int,
    grading_request: SubmissionGradingRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Manually trigger grading for a submission.

    Only professors who teach the course can grade submissions.
    """
    # Check permission (only professors can manually grade)
    if current_user.role not in ["professor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professors can manually trigger grading",
        )

    # Get submission
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found"
        )

    # Get the assignment to check the course
    assignment = (
        db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    )
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated assignment not found",
        )

    # For professors, check if they teach the course
    if current_user.role == "professor":
        # Check if professor teaches this course
        professor_course = (
            db.query(CourseUser)
            .filter(
                CourseUser.user_id == current_user.id,
                CourseUser.course_id == assignment.course_id,
                CourseUser.role == "professor",
            )
            .first()
        )

        if not professor_course:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to grade submissions for this course",
            )

    # Add grading task to background tasks
    background_tasks.add_task(
        process_submission_grading,
        db=db,
        submission_id=submission.id,
        strictness=grading_request.strictness,
    )

    # Update submission status
    submission.status = "submitted"  # Reset to submitted for regrading
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Get assignment title
    assignment_title = assignment.title if assignment else None

    # Get student info if professor
    student_name = None
    student_email = None
    if current_user.role in ["professor", "admin"]:
        student = db.query(User).filter(User.id == submission.user_id).first()
        if student:
            student_name = f"{student.first_name} {student.last_name}"
            student_email = student.email

    # Create response with properly formatted fields
    response = {
        "id": submission.id,
        "assignment_id": submission.assignment_id,
        "assignment_title": assignment_title,
        "user_id": submission.user_id,
        "student_name": student_name,
        "student_email": student_email,
        "submission_time": submission.submission_time,
        "is_late": submission.is_late,
        "file_name": submission.file_name,
        "file_path": submission.file_path,
        "file_type": submission.file_type,
        "submission_text": submission.submission_text,
        "attempt_number": submission.attempt_number,
        "status": submission.status,
        "feedback": None,  # No feedback yet since it's being reprocessed
    }

    return response
