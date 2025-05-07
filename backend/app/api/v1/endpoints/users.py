from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.api.dependencies import get_db
from app.core.auth import get_current_active_user
from app.database.models import User, CourseUser, Course
from app.models.user import UserResponse, UserUpdate, CourseSelection
from app.models.course import CourseResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)) -> Any:
    """
    Get current user information.

    Args:
        current_user (User): Current authenticated user

    Returns:
        User: Current user information
    """
    return current_user


@router.put("/me", response_model=UserResponse)
def update_current_user(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    user_in: UserUpdate,
) -> Any:
    """
    Update current user information.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user
        user_in (UserUpdate): User data to update

    Returns:
        User: Updated user information
    """
    # Update user data
    if user_in.first_name is not None:
        current_user.first_name = user_in.first_name
    if user_in.last_name is not None:
        current_user.last_name = user_in.last_name
    if user_in.phone_number is not None:
        current_user.phone_number = user_in.phone_number

    current_user = db.merge(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user


@router.get("/me/courses", response_model=List[CourseResponse])
def get_user_courses(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get courses for current user.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user

    Returns:
        List[Course]: User's enrolled courses
    """
    # Query courses user is enrolled in
    courses = (
        db.query(Course)
        .join(CourseUser, CourseUser.course_id == Course.id)
        .filter(CourseUser.user_id == current_user.id)
        .all()
    )

    return courses


@router.post("/me/courses", response_model=List[CourseResponse])
def select_user_courses(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    course_selection: CourseSelection,
) -> Any:
    """
    Select courses for current user.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user
        course_selection (CourseSelection): Course selection data

    Raises:
        HTTPException: When courses not found or exceeding maximum allowed courses

    Returns:
        List[Course]: Selected courses
    """
    # Get selected courses
    course_ids = course_selection.course_ids
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()

    # Check if all courses exist
    if len(courses) != len(course_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or more courses not found",
        )
    
    # Get user's current enrolled courses
    current_enrollments = db.query(CourseUser).filter(CourseUser.user_id == current_user.id).all()
    
    # Extract current course IDs
    current_course_ids = [enrollment.course_id for enrollment in current_enrollments]
    
    # Find new courses to enroll in (filter out already enrolled courses)
    new_course_ids = [course_id for course_id in course_ids if course_id not in current_course_ids]
    
    # Check if adding these new courses would exceed the maximum allowed (3 for students)
    if current_user.role == "student" and len(current_course_ids) + len(new_course_ids) > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Students can enroll in a maximum of 3 courses",
        )
    
    # Create new course enrollments
    for course_id in new_course_ids:
        # Create role value as a properly typed ENUM value
        role_value = "student" if current_user.role == "student" else "professor"

        # Use text() to explicitly cast the string to the ENUM type
        role_cast = text(f"'{role_value}'::course_user_role")

        # Create the course user with the properly cast role
        course_user = CourseUser(
            course_id=course_id,
            user_id=current_user.id,
        )
        # Set the role using the SQLAlchemy core expression
        course_user.role = role_cast

        db.add(course_user)

    db.commit()

    # Get updated course list for the user (including existing and new courses)
    all_course_ids = current_course_ids + new_course_ids
    updated_courses = db.query(Course).filter(Course.id.in_(all_course_ids)).all()

    return updated_courses
