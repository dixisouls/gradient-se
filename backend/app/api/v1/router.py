from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    courses,
    search,
    submissions,
    assignments,
    chat,
)

# Create API router
api_router = APIRouter()

# Include routers from endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(
    submissions.router, prefix="/submissions", tags=["Submissions"]
)
api_router.include_router(
    assignments.router, prefix="/assignments", tags=["Assignments"]
)
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
