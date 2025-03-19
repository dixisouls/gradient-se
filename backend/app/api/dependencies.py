from typing import Generator

from app.database.db import SessionLocal


def get_db() -> Generator:
    """
    Get database session.

    Yields:
        Generator: Database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
