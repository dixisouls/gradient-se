from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, courses, search

# Create API router
api_router = APIRouter()

# Include routers from endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
