from typing import Any, List, Dict, Optional
from math import ceil

from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, and_, func
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.auth import get_current_active_user
from app.database.models import Course, Assignment, User
from app.models.search import (
    BasicSearchParams,
    AdvancedSearchParams,
    SearchResponse,
    SearchResult,
    SearchResultMetadata,
)

router = APIRouter()


@router.get("/basic", response_model=SearchResponse)
def basic_search(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    query: str = Query(..., min_length=1),
    entity_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
) -> Any:
    """
    Perform a basic search across entities.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user
        query (str): Search query
        entity_type (Optional[str]): Entity type to search (course, assignment, user)
        page (int): Page number
        per_page (int): Items per page

    Returns:
        dict: Search results
    """
    search_term = f"%{query}%"
    results: List[Dict] = []
    total = 0

    # Calculate offset
    offset = (page - 1) * per_page

    # Search courses
    if not entity_type or entity_type == "course":
        courses_query = db.query(
            Course.id, Course.code, Course.name, Course.description, Course.term
        ).filter(
            or_(
                Course.name.ilike(search_term),
                Course.code.ilike(search_term),
                Course.description.ilike(search_term),
            )
        )

        # Get total count for courses
        courses_count = courses_query.count()
        total += courses_count

        # Get courses with pagination if this is the only entity type
        if entity_type == "course":
            courses = courses_query.offset(offset).limit(per_page).all()
        else:
            # Otherwise get a limited number for mixed results
            courses = courses_query.limit(per_page).all()

        # Convert courses to search results
        for course in courses:
            # Calculate relevance score (simple implementation)
            relevance = 1.0
            if query.lower() in course.name.lower():
                relevance = 1.0
            elif query.lower() in course.code.lower():
                relevance = 0.9
            elif course.description and query.lower() in course.description.lower():
                relevance = 0.7

            results.append(
                {
                    "id": course.id,
                    "type": "course",
                    "title": f"{course.code}: {course.name}",
                    "description": course.description,
                    "relevance": relevance,
                    "metadata": {"term": course.term},
                }
            )

    # Search assignments
    if not entity_type or entity_type == "assignment":
        assignments_query = db.query(
            Assignment.id,
            Assignment.title,
            Assignment.description,
            Assignment.assignment_type,
            Assignment.due_date,
            Assignment.points_possible,
            Assignment.course_id,
        ).filter(
            or_(
                Assignment.title.ilike(search_term),
                Assignment.description.ilike(search_term),
            )
        )

        # Get total count for assignments
        assignments_count = assignments_query.count()
        total += assignments_count

        # Get assignments with pagination if this is the only entity type
        if entity_type == "assignment":
            assignments = assignments_query.offset(offset).limit(per_page).all()
        else:
            # Otherwise get a limited number for mixed results
            assignments = assignments_query.limit(per_page).all()

        # Convert assignments to search results
        for assignment in assignments:
            # Calculate relevance score (simple implementation)
            relevance = 1.0
            if query.lower() in assignment.title.lower():
                relevance = 1.0
            elif (
                assignment.description
                and query.lower() in assignment.description.lower()
            ):
                relevance = 0.8

            results.append(
                {
                    "id": assignment.id,
                    "type": "assignment",
                    "title": assignment.title,
                    "description": assignment.description,
                    "relevance": relevance,
                    "metadata": {
                        "course_id": assignment.course_id,
                        "due_date": (
                            assignment.due_date.isoformat()
                            if assignment.due_date
                            else None
                        ),
                        "points_possible": assignment.points_possible,
                    },
                }
            )

    # Search users
    if not entity_type or entity_type == "user":
        users_query = db.query(
            User.id, User.first_name, User.last_name, User.email, User.role
        ).filter(
            or_(
                User.first_name.ilike(search_term),
                User.last_name.ilike(search_term),
                User.email.ilike(search_term),
            )
        )

        # Get total count for users
        users_count = users_query.count()
        total += users_count

        # Get users with pagination if this is the only entity type
        if entity_type == "user":
            users = users_query.offset(offset).limit(per_page).all()
        else:
            # Otherwise get a limited number for mixed results
            users = users_query.limit(per_page).all()

        # Convert users to search results
        for user in users:
            # Calculate relevance score (simple implementation)
            relevance = 1.0
            if (
                query.lower() in user.first_name.lower()
                or query.lower() in user.last_name.lower()
            ):
                relevance = 1.0
            elif query.lower() in user.email.lower():
                relevance = 0.8

            results.append(
                {
                    "id": user.id,
                    "type": "user",
                    "title": f"{user.first_name} {user.last_name}",
                    "description": user.email,
                    "relevance": relevance,
                    "metadata": {"role": user.role},
                }
            )

    # Sort results by relevance
    results = sorted(results, key=lambda x: x["relevance"], reverse=True)

    # Apply pagination for mixed results
    if not entity_type:
        results = results[offset : offset + per_page]

    # Calculate total pages
    pages = ceil(total / per_page)

    return {
        "results": results,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages,
    }


@router.post("/advanced", response_model=SearchResponse)
def advanced_search(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    search_params: AdvancedSearchParams,
) -> Any:
    """
    Perform an advanced search with filters and sorting.

    Args:
        db (Session): Database session
        current_user (User): Current authenticated user
        search_params (AdvancedSearchParams): Advanced search parameters

    Returns:
        dict: Search results
    """
    entity_type = search_params.entity_type
    query = search_params.query
    filters = search_params.filters or {}
    sort_by = search_params.sort_by
    sort_direction = search_params.sort_direction
    page = search_params.page
    per_page = search_params.per_page

    search_term = f"%{query}%" if query else None
    results = []
    total = 0

    # Calculate offset
    offset = (page - 1) * per_page

    # Search courses
    if not entity_type or entity_type.value == "course":
        # Build base query
        courses_query = db.query(
            Course.id,
            Course.code,
            Course.name,
            Course.description,
            Course.term,
            Course.created_at,
        )

        # Apply search term if provided
        if search_term:
            courses_query = courses_query.filter(
                or_(
                    Course.name.ilike(search_term),
                    Course.code.ilike(search_term),
                    Course.description.ilike(search_term),
                )
            )

        # Apply filters if provided
        filter_conditions = []
        if "term" in filters:
            filter_conditions.append(Course.term == filters["term"])

        if filter_conditions:
            courses_query = courses_query.filter(and_(*filter_conditions))

        # Apply sorting
        if sort_by == "name":
            courses_query = courses_query.order_by(
                Course.name.asc()
                if sort_direction.value == "asc"
                else Course.name.desc()
            )
        elif sort_by == "code":
            courses_query = courses_query.order_by(
                Course.code.asc()
                if sort_direction.value == "asc"
                else Course.code.desc()
            )
        elif sort_by == "term":
            courses_query = courses_query.order_by(
                Course.term.asc()
                if sort_direction.value == "asc"
                else Course.term.desc()
            )
        elif sort_by == "created_at":
            courses_query = courses_query.order_by(
                Course.created_at.asc()
                if sort_direction.value == "asc"
                else Course.created_at.desc()
            )

        # Get total count for courses
        courses_count = courses_query.count()
        total += courses_count

        # Get courses with pagination if this is the only entity type
        if entity_type and entity_type.value == "course":
            courses = courses_query.offset(offset).limit(per_page).all()
        else:
            # Otherwise get a limited number for mixed results
            courses = courses_query.limit(per_page).all()

        # Convert courses to search results
        for course in courses:
            # Calculate relevance score (simple implementation)
            relevance = 1.0
            if query and query.lower() in course.name.lower():
                relevance = 1.0
            elif query and query.lower() in course.code.lower():
                relevance = 0.9
            elif (
                query
                and course.description
                and query.lower() in course.description.lower()
            ):
                relevance = 0.7

            results.append(
                {
                    "id": course.id,
                    "type": "course",
                    "title": f"{course.code}: {course.name}",
                    "description": course.description,
                    "relevance": relevance,
                    "metadata": {"term": course.term},
                }
            )

    # Search assignments
    if not entity_type or entity_type.value == "assignment":
        # Build base query
        assignments_query = db.query(
            Assignment.id,
            Assignment.title,
            Assignment.description,
            Assignment.assignment_type,
            Assignment.due_date,
            Assignment.points_possible,
            Assignment.course_id,
            Assignment.created_at,
        )

        # Apply search term if provided
        if search_term:
            assignments_query = assignments_query.filter(
                or_(
                    Assignment.title.ilike(search_term),
                    Assignment.description.ilike(search_term),
                )
            )

        # Apply filters if provided
        filter_conditions = []
        if "course_id" in filters:
            filter_conditions.append(Assignment.course_id == filters["course_id"])
        if "assignment_type" in filters:
            filter_conditions.append(
                Assignment.assignment_type == filters["assignment_type"]
            )
        if "points_min" in filters:
            filter_conditions.append(
                Assignment.points_possible >= filters["points_min"]
            )
        if "points_max" in filters:
            filter_conditions.append(
                Assignment.points_possible <= filters["points_max"]
            )

        if filter_conditions:
            assignments_query = assignments_query.filter(and_(*filter_conditions))

        # Apply sorting
        if sort_by == "title":
            assignments_query = assignments_query.order_by(
                Assignment.title.asc()
                if sort_direction.value == "asc"
                else Assignment.title.desc()
            )
        elif sort_by == "due_date":
            assignments_query = assignments_query.order_by(
                Assignment.due_date.asc()
                if sort_direction.value == "asc"
                else Assignment.due_date.desc()
            )
        elif sort_by == "points_possible":
            assignments_query = assignments_query.order_by(
                Assignment.points_possible.asc()
                if sort_direction.value == "asc"
                else Assignment.points_possible.desc()
            )
        elif sort_by == "created_at":
            assignments_query = assignments_query.order_by(
                Assignment.created_at.asc()
                if sort_direction.value == "asc"
                else Assignment.created_at.desc()
            )

        # Get total count for assignments
        assignments_count = assignments_query.count()
        total += assignments_count

        # Get assignments with pagination if this is the only entity type
        if entity_type and entity_type.value == "assignment":
            assignments = assignments_query.offset(offset).limit(per_page).all()
        else:
            # Otherwise get a limited number for mixed results
            assignments = assignments_query.limit(per_page).all()

        # Convert assignments to search results
        for assignment in assignments:
            # Calculate relevance score (simple implementation)
            relevance = 1.0
            if query and query.lower() in assignment.title.lower():
                relevance = 1.0
            elif (
                query
                and assignment.description
                and query.lower() in assignment.description.lower()
            ):
                relevance = 0.8

            results.append(
                {
                    "id": assignment.id,
                    "type": "assignment",
                    "title": assignment.title,
                    "description": assignment.description,
                    "relevance": relevance,
                    "metadata": {
                        "course_id": assignment.course_id,
                        "due_date": (
                            assignment.due_date.isoformat()
                            if assignment.due_date
                            else None
                        ),
                        "points_possible": assignment.points_possible,
                    },
                }
            )

    # Search users
    if not entity_type or entity_type.value == "user":
        # Build base query
        users_query = db.query(
            User.id,
            User.first_name,
            User.last_name,
            User.email,
            User.role,
            User.created_at,
        )

        # Apply search term if provided
        if search_term:
            users_query = users_query.filter(
                or_(
                    User.first_name.ilike(search_term),
                    User.last_name.ilike(search_term),
                    User.email.ilike(search_term),
                )
            )

        # Apply filters if provided
        filter_conditions = []
        if "role" in filters:
            filter_conditions.append(User.role == filters["role"])

        if filter_conditions:
            users_query = users_query.filter(and_(*filter_conditions))

        # Apply sorting
        if sort_by == "name":
            users_query = users_query.order_by(
                (
                    User.first_name.asc()
                    if sort_direction.value == "asc"
                    else User.first_name.desc()
                ),
                (
                    User.last_name.asc()
                    if sort_direction.value == "asc"
                    else User.last_name.desc()
                ),
            )
        elif sort_by == "email":
            users_query = users_query.order_by(
                User.email.asc() if sort_direction.value == "asc" else User.email.desc()
            )
        elif sort_by == "role":
            users_query = users_query.order_by(
                User.role.asc() if sort_direction.value == "asc" else User.role.desc()
            )
        elif sort_by == "created_at":
            users_query = users_query.order_by(
                User.created_at.asc()
                if sort_direction.value == "asc"
                else User.created_at.desc()
            )

        # Get total count for users
        users_count = users_query.count()
        total += users_count

        # Get users with pagination if this is the only entity type
        if entity_type and entity_type.value == "user":
            users = users_query.offset(offset).limit(per_page).all()
        else:
            # Otherwise get a limited number for mixed results
            users = users_query.limit(per_page).all()

        # Convert users to search results
        for user in users:
            # Calculate relevance score (simple implementation)
            relevance = 1.0
            if query and (
                query.lower() in user.first_name.lower()
                or query.lower() in user.last_name.lower()
            ):
                relevance = 1.0
            elif query and query.lower() in user.email.lower():
                relevance = 0.8

            results.append(
                {
                    "id": user.id,
                    "type": "user",
                    "title": f"{user.first_name} {user.last_name}",
                    "description": user.email,
                    "relevance": relevance,
                    "metadata": {"role": user.role},
                }
            )

    # Sort results by relevance for combined searches, or use requested sort for specific entity
    if not entity_type:
        results = sorted(results, key=lambda x: x["relevance"], reverse=True)

    # Apply pagination for mixed results
    if not entity_type:
        results = results[offset : offset + per_page]

    # Calculate total pages
    pages = ceil(total / per_page)

    return {
        "results": results,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages,
    }
