from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from pydantic import ValidationError

from app.database.db import get_db
from app.database.models import User
from app.models.token import TokenPayload
from app.config import settings

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """
    Get current authenticated user.

    Args:
        db (Session): Database session
        token (str): JWT token

    Raises:
        HTTPException: When credentials are invalid

    Returns:
        User: Current user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode JWT token
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(sub=payload.get("sub"), role=payload.get("role"))

        if token_data.sub is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception

    # Get user from database
    user = db.query(User).filter(User.email == token_data.sub).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Get current active user.

    Args:
        current_user (User): Current authenticated user

    Raises:
        HTTPException: When user is inactive

    Returns:
        User: Current active user
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


def check_is_admin(current_user: User = Depends(get_current_active_user)) -> User:
    """
    Check if current user is admin.

    Args:
        current_user (User): Current authenticated user

    Raises:
        HTTPException: When user is not admin

    Returns:
        User: Current admin user
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user


def check_is_professor_or_admin(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Check if current user is professor or admin.

    Args:
        current_user (User): Current authenticated user

    Raises:
        HTTPException: When user is not professor or admin

    Returns:
        User: Current professor or admin user
    """
    if current_user.role not in ["professor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
