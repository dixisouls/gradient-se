from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class SearchEntityType(str, Enum):
    """Search entity type enum."""

    COURSE = "course"
    ASSIGNMENT = "assignment"
    USER = "user"


class BasicSearchParams(BaseModel):
    """Basic search parameters model."""

    query: str = Field(..., min_length=1)
    entity_type: Optional[SearchEntityType] = None


class SortDirection(str, Enum):
    """Sort direction enum."""

    ASC = "asc"
    DESC = "desc"


class AdvancedSearchParams(BaseModel):
    """Advanced search parameters model."""

    query: Optional[str] = None
    entity_type: Optional[SearchEntityType] = None
    filters: Optional[Dict[str, Any]] = None
    sort_by: Optional[str] = None
    sort_direction: Optional[SortDirection] = SortDirection.ASC
    page: int = Field(1, ge=1)
    per_page: int = Field(10, ge=1, le=100)


class SearchResultMetadata(BaseModel):
    """Search result metadata model."""

    term: Optional[str] = None
    role: Optional[str] = None
    course_id: Optional[int] = None
    due_date: Optional[str] = None
    points_possible: Optional[int] = None


class SearchResult(BaseModel):
    """Search result model."""

    id: int
    type: str
    title: str
    description: Optional[str] = None
    relevance: float
    metadata: SearchResultMetadata


class SearchResponse(BaseModel):
    """Search response model."""

    results: List[SearchResult]
    total: int
    page: int
    per_page: int
    pages: int
