from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.api.dependencies import get_db
from app.core.auth import get_current_active_user, check_is_professor_or_admin
from app.database.models import Assignment, Course, User, CourseUser
from app.models.assignment import (
    AssignmentCreate,
    AssignmentResponse,
    AssignmentList,
    AssignmentUpdate,
)
import os
import shutil
from datetime import datetime

router = APIRouter()


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


@router.get("/", response_model=AssignmentList)
def get_assignments(
    course_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all assignments with optional filtering.

    Students can only see assignments for courses they are enrolled in.
    Professors and admins can see all assignments or filter by course.
    """
    # Build query
    query = db.query(Assignment)

    # Filter by course if provided
    if course_id:
        query = query.filter(Assignment.course_id == course_id)

    # If user is a student, only show assignments for enrolled courses
    if current_user.role == "student":
        # Get the courses the student is enrolled in
        enrolled_course_ids = (
            db.query(CourseUser.course_id)
            .filter(CourseUser.user_id == current_user.id)
            .all()
        )

        # Extract the course IDs from the result
        enrolled_course_ids = [course_id for (course_id,) in enrolled_course_ids]

        # Filter assignments to only show those from enrolled courses
        query = query.filter(Assignment.course_id.in_(enrolled_course_ids))

    # Get total count
    total = query.count()

    # Apply pagination
    assignments = query.offset(skip).limit(limit).all()

    # Enhance assignments with course information
    result = []
    for assignment in assignments:
        # Get course info
        course = db.query(Course).filter(Course.id == assignment.course_id).first()
        course_name = course.name if course else None
        course_code = course.code if course else None

        # Create enhanced assignment object
        assignment_data = {
            "id": assignment.id,
            "course_id": assignment.course_id,
            "course_name": course_name,
            "course_code": course_code,
            "title": assignment.title,
            "description": assignment.description,
            "assignment_type": assignment.assignment_type,
            "due_date": assignment.due_date,
            "points_possible": assignment.points_possible,
            "allow_resubmissions": assignment.allow_resubmissions,
            "resubmission_deadline": assignment.resubmission_deadline,
            "created_at": assignment.created_at,
            "updated_at": assignment.updated_at,
            "created_by": assignment.created_by,
            # Don't include reference solution in response
        }
        result.append(assignment_data)

    return {"assignments": result, "total": total}


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific assignment by ID.

    Students can only access assignments for courses they are enrolled in.
    """
    # Get assignment by ID
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )

    # Check permission for students (enrolled in the course)
    if current_user.role == "student":
        # Check if student is enrolled in the course
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
                detail="You don't have access to this assignment",
            )

    # Get course info
    course = db.query(Course).filter(Course.id == assignment.course_id).first()
    course_name = course.name if course else None
    course_code = course.code if course else None

    # Create response
    response = {
        "id": assignment.id,
        "course_id": assignment.course_id,
        "course_name": course_name,
        "course_code": course_code,
        "title": assignment.title,
        "description": assignment.description,
        "assignment_type": assignment.assignment_type,
        "due_date": assignment.due_date,
        "points_possible": assignment.points_possible,
        "allow_resubmissions": assignment.allow_resubmissions,
        "resubmission_deadline": assignment.resubmission_deadline,
        "created_at": assignment.created_at,
        "updated_at": assignment.updated_at,
        "created_by": assignment.created_by,
        # Only include reference_solution if user is a professor or admin
        "reference_solution": (
            assignment.reference_solution
            if current_user.role in ["professor", "admin"]
            else None
        ),
    }

    return response


@router.post(
    "/",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(check_is_professor_or_admin)],
)
async def create_assignment(
    course_id: int = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    assignment_type: str = Form(...),
    due_date: datetime = Form(...),
    points_possible: int = Form(...),
    allow_resubmissions: bool = Form(False),
    resubmission_deadline: Optional[datetime] = Form(None),
    reference_solution: Optional[str] = Form(None),
    reference_solution_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new assignment (professors and admins only).
    """
    # Validate course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Course not found"
        )

    # If professor (not admin), check if they teach this course
    if current_user.role == "professor":
        # Check if professor is assigned to this course
        professor_course = (
            db.query(CourseUser)
            .filter(
                CourseUser.user_id == current_user.id,
                CourseUser.course_id == course_id,
                CourseUser.role == "professor",
            )
            .first()
        )

        if not professor_course:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to create assignments for this course",
            )

    # Check resubmission deadline if applicable
    if allow_resubmissions:
        if not resubmission_deadline:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resubmission deadline is required when resubmissions are allowed",
            )
        # Ensure resubmission deadline is after due date
        if resubmission_deadline <= due_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resubmission deadline must be after the due date",
            )

    # Handle reference solution file if provided
    reference_solution_file_path = None
    if reference_solution_file:
        # Create directory if it doesn't exist
        os.makedirs("uploads/reference_solutions", exist_ok=True)

        # Generate unique file name
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        file_name = f"{course_id}_{timestamp}_{reference_solution_file.filename}"
        reference_solution_file_path = f"uploads/reference_solutions/{file_name}"

        # Save file
        save_upload_file(reference_solution_file, reference_solution_file_path)

    # Create assignment
    assignment = Assignment(
        course_id=course_id,
        title=title,
        description=description,
        assignment_type=assignment_type,
        due_date=due_date,
        points_possible=points_possible,
        allow_resubmissions=allow_resubmissions,
        resubmission_deadline=resubmission_deadline if allow_resubmissions else None,
        created_by=current_user.id,
        reference_solution=reference_solution,
        reference_solution_file_path=reference_solution_file_path,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    # Create response with course info
    response = {
        "id": assignment.id,
        "course_id": assignment.course_id,
        "course_name": course.name,
        "course_code": course.code,
        "title": assignment.title,
        "description": assignment.description,
        "assignment_type": assignment.assignment_type,
        "due_date": assignment.due_date,
        "points_possible": assignment.points_possible,
        "allow_resubmissions": assignment.allow_resubmissions,
        "resubmission_deadline": assignment.resubmission_deadline,
        "created_at": assignment.created_at,
        "updated_at": assignment.updated_at,
        "created_by": assignment.created_by,
        "reference_solution": assignment.reference_solution,
    }

    return response


@router.put(
    "/{assignment_id}",
    response_model=AssignmentResponse,
    dependencies=[Depends(check_is_professor_or_admin)],
)
async def update_assignment(
    assignment_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    assignment_type: Optional[str] = Form(None),
    due_date: Optional[datetime] = Form(None),
    points_possible: Optional[int] = Form(None),
    allow_resubmissions: Optional[bool] = Form(None),
    resubmission_deadline: Optional[datetime] = Form(None),
    reference_solution: Optional[str] = Form(None),
    reference_solution_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update an assignment (professors and admins only).
    """
    # Get assignment by ID
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )

    # If professor (not admin), check if they teach this course
    if current_user.role == "professor":
        # Check if professor is assigned to this course
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
                detail="You don't have permission to update assignments for this course",
            )

    # Check if we're updating resubmission settings
    new_allow_resubmissions = (
        allow_resubmissions
        if allow_resubmissions is not None
        else assignment.allow_resubmissions
    )
    new_due_date = due_date if due_date is not None else assignment.due_date

    # If allowing resubmissions, ensure resubmission deadline is valid
    if new_allow_resubmissions:
        new_resubmission_deadline = (
            resubmission_deadline
            if resubmission_deadline is not None
            else assignment.resubmission_deadline
        )

        if not new_resubmission_deadline:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resubmission deadline is required when resubmissions are allowed",
            )

        # Check that resubmission deadline is after due date
        if new_resubmission_deadline <= new_due_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resubmission deadline must be after the due date",
            )
    else:
        # If not allowing resubmissions, set resubmission_deadline to None
        new_resubmission_deadline = None

    # Handle reference solution file if provided
    reference_solution_file_path = None
    if reference_solution_file:
        # Create directory if it doesn't exist
        os.makedirs("uploads/reference_solutions", exist_ok=True)

        # Generate unique file name
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        file_name = (
            f"{assignment.course_id}_{timestamp}_{reference_solution_file.filename}"
        )
        reference_solution_file_path = f"uploads/reference_solutions/{file_name}"

        # Save file
        save_upload_file(reference_solution_file, reference_solution_file_path)

    # Update assignment data
    if title is not None:
        assignment.title = title
    if description is not None:
        assignment.description = description
    if assignment_type is not None:
        assignment.assignment_type = assignment_type
    if due_date is not None:
        assignment.due_date = due_date
    if points_possible is not None:
        assignment.points_possible = points_possible
    if allow_resubmissions is not None:
        assignment.allow_resubmissions = allow_resubmissions

    # Update resubmission deadline based on the allow_resubmissions flag
    assignment.resubmission_deadline = new_resubmission_deadline

    if reference_solution is not None:
        assignment.reference_solution = reference_solution
    if reference_solution_file_path is not None:
        assignment.reference_solution_file_path = reference_solution_file_path

    # Update timestamp
    assignment.updated_at = func.now()

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    # Get course info
    course = db.query(Course).filter(Course.id == assignment.course_id).first()
    course_name = course.name if course else None
    course_code = course.code if course else None

    # Create response
    response = {
        "id": assignment.id,
        "course_id": assignment.course_id,
        "course_name": course_name,
        "course_code": course_code,
        "title": assignment.title,
        "description": assignment.description,
        "assignment_type": assignment.assignment_type,
        "due_date": assignment.due_date,
        "points_possible": assignment.points_possible,
        "allow_resubmissions": assignment.allow_resubmissions,
        "resubmission_deadline": assignment.resubmission_deadline,
        "created_at": assignment.created_at,
        "updated_at": assignment.updated_at,
        "created_by": assignment.created_by,
        "reference_solution": assignment.reference_solution,
    }

    return response


@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(check_is_professor_or_admin)],
)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """
    Delete an assignment (professors and admins only).
    """
    # Get assignment by ID
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
        )

    # If professor (not admin), check if they teach this course
    if current_user.role == "professor":
        # Check if professor is assigned to this course
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
                detail="You don't have permission to delete assignments for this course",
            )

    # Delete assignment
    db.delete(assignment)
    db.commit()

    return
