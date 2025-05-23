from typing import Any, Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.auth import get_current_active_user, check_is_professor_or_admin
from app.database.models import Course, User, CourseUser
from app.models.course import CourseResponse, CourseList, CourseCreate, CourseUpdate
from app.models.user import UserResponse

router = APIRouter()


@router.get("/", response_model=CourseList)
def get_courses(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    term: Optional[str] = None,
) -> Any:
    """
    Get all courses with optional filtering.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user
        skip (int): Number of courses to skip
        limit (int): Maximum number of courses to return
        term (Optional[str]): Filter by term

    Returns:
        dict: Courses list and total count
    """
    # Build query
    query = db.query(Course)

    # Apply term filter if provided
    if term:
        query = query.filter(Course.term == term)

    # Get total count
    total = query.count()

    # Get courses with pagination
    courses = query.offset(skip).limit(limit).all()

    # Prepare response with professors
    result_courses = []
    for course in courses:
        # Get professors for this course
        professors = (
            db.query(User)
            .join(CourseUser, CourseUser.user_id == User.id)
            .filter(CourseUser.course_id == course.id, CourseUser.role == "professor")
            .all()
        )
        
        # Create professor info list
        professor_info = [
            {
                "id": prof.id,
                "first_name": prof.first_name,
                "last_name": prof.last_name,
                "email": prof.email
            }
            for prof in professors
        ]
        
        # Create course dict with professors
        course_dict = {
            "id": course.id,
            "code": course.code,
            "name": course.name,
            "description": course.description,
            "term": course.term,
            "created_at": course.created_at,
            "updated_at": course.updated_at,
            "professors": professor_info
        }
        
        result_courses.append(course_dict)

    return {"courses": result_courses, "total": total}

@router.get("/available-professors", response_model=List[UserResponse])
def get_available_professors(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all available professors.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user

    Returns:
        List[UserResponse]: List of professors
    """
    # Query professors from database
    professors = db.query(User).filter(User.role == "professor", User.is_active == True).all()
    
    return professors


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    course_id: int,
) -> Any:
    """
    Get a specific course by ID.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user
        course_id (int): Course ID

    Raises:
        HTTPException: When course not found

    Returns:
        Course: Course information
    """
    # Get course by ID
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Course not found"
        )

    # Get professors for this course
    professors = (
        db.query(User)
        .join(CourseUser, CourseUser.user_id == User.id)
        .filter(CourseUser.course_id == course_id, CourseUser.role == "professor")
        .all()
    )
    
    # Create professor info list
    professor_info = [
        {
            "id": prof.id,
            "first_name": prof.first_name,
            "last_name": prof.last_name,
            "email": prof.email
        }
        for prof in professors
    ]
    
    # Create course dict with professors
    course_dict = {
        "id": course.id,
        "code": course.code,
        "name": course.name,
        "description": course.description,
        "term": course.term,
        "created_at": course.created_at,
        "updated_at": course.updated_at,
        "professors": professor_info
    }
    
    return course_dict


@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(check_is_professor_or_admin)],
)
def create_course(*, db: Session = Depends(get_db), course_in: CourseCreate, current_user: User = Depends(get_current_active_user)) -> Any:
    """
    Create a new course (professors and admins only) and assign a professor.

    Args:
        db (Session): Database session
        course_in (CourseCreate): Course data including professor_id
        current_user (User): Current authenticated user

    Raises:
        HTTPException: When course with code and term already exists or professor not found

    Returns:
        Course: Created course with professor assigned
    """
    # Check if course already exists
    existing_course = (
        db.query(Course)
        .filter(Course.code == course_in.code, Course.term == course_in.term)
        .first()
    )

    if existing_course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Course with code {course_in.code} for term {course_in.term} already exists",
        )

    # Check if professor exists
    professor = db.query(User).filter(User.id == course_in.professor_id, User.role == "professor").first()
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor not found",
        )

    # Create new course
    course_data = course_in.model_dump(exclude={"professor_id"})
    course = Course(**course_data)
    db.add(course)
    db.flush()  # Get the course ID without committing

    # Create course-user relationship for the professor
    from sqlalchemy import text
    
    # Use text() to explicitly cast the string to the ENUM type
    role_cast = text("'professor'::course_user_role")
    
    # Create the course user record
    course_user = CourseUser(
        course_id=course.id,
        user_id=professor.id,
    )
    # Set the role using the SQLAlchemy core expression
    course_user.role = role_cast
    db.add(course_user)

    db.commit()
    db.refresh(course)

    # Get professor info for response
    professor_info = {
        "id": professor.id,
        "first_name": professor.first_name,
        "last_name": professor.last_name,
        "email": professor.email
    }
    
    # Create response with professors information
    course_dict = {
        "id": course.id,
        "code": course.code,
        "name": course.name,
        "description": course.description,
        "term": course.term,
        "created_at": course.created_at,
        "updated_at": course.updated_at,
        "professors": [professor_info]
    }
    
    return course_dict


@router.put(
    "/{course_id}",
    response_model=CourseResponse,
    dependencies=[Depends(check_is_professor_or_admin)],
)
def update_course(
    *, db: Session = Depends(get_db), course_id: int, course_in: CourseUpdate
) -> Any:
    """
    Update a course (professors and admins only).

    Args:
        db (Session): Database session
        course_id (int): Course ID
        course_in (CourseUpdate): Course data to update

    Raises:
        HTTPException: When course not found

    Returns:
        Course: Updated course
    """
    # Get course by ID
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Course not found"
        )

    # Update course data
    update_data = course_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)

    db.add(course)
    db.commit()
    db.refresh(course)

    return course


@router.post(
    "/seed",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(check_is_professor_or_admin)],
)
def seed_courses(*, db: Session = Depends(get_db)) -> Any:
    """
    Seed database with additional courses (professors and admins only).

    Args:
        db (Session): Database session

    Returns:
        dict: Success message
    """
    # New courses to add
    new_courses = [
        {
            "code": "CS401",
            "name": "Advanced Algorithms",
            "description": "Study of advanced algorithms and computational complexity.",
            "term": "Spring 2025",
        },
        {
            "code": "CS450",
            "name": "Machine Learning",
            "description": "Introduction to machine learning algorithms and applications.",
            "term": "Spring 2025",
        },
        {
            "code": "ENG301",
            "name": "Technical Writing",
            "description": "Advanced technical writing skills for engineers and scientists.",
            "term": "Spring 2025",
        },
        {
            "code": "PSYCH201",
            "name": "Cognitive Psychology",
            "description": "Introduction to cognitive processes and mental functions.",
            "term": "Spring 2025",
        },
        {
            "code": "MATH401",
            "name": "Advanced Calculus",
            "description": "Rigorous treatment of calculus concepts including limits, continuity, and differentiation.",
            "term": "Spring 2025",
        },
    ]

    # Count how many courses were added
    added_count = 0

    # Add new courses if they don't exist
    for course_data in new_courses:
        # Check if course already exists
        existing_course = (
            db.query(Course)
            .filter(
                Course.code == course_data["code"], Course.term == course_data["term"]
            )
            .first()
        )

        if not existing_course:
            # Create new course
            course = Course(**course_data)
            db.add(course)
            added_count += 1

    db.commit()

    return {
        "message": f"Successfully added {added_count} new courses",
        "total_added": added_count,
    }