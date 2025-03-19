from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.dependencies import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.auth import get_current_active_user
from app.database.models import User, UserPreference
from app.models.token import Token
from app.models.user import UserCreate, UserResponse
from app.config import settings

router = APIRouter()


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register_user(*, db: Session = Depends(get_db), user_in: UserCreate) -> Any:
    """
    Register a new user.

    Args:
        db (Session): Database session
        user_in (UserCreate): User data

    Raises:
        HTTPException: When email already exists

    Returns:
        User: Created user
    """
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system. Please login.",
        )

    # Create new user
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role.value,
        phone_number=user_in.phone_number,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.

    Args:
        db (Session): Database session
        form_data (OAuth2PasswordRequestForm): Login credentials

    Raises:
        HTTPException: When credentials are invalid

    Returns:
        dict: Access token and token type
    """
    # Get user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login time
    user.last_login = func.now()
    db.commit()

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        subject=user.email, role=user.role, expires_delta=access_token_expires
    )

    return {"access_token": token, "token_type": "bearer"}


@router.post("/refresh-token", response_model=Token)
def refresh_token(current_user: User = Depends(get_current_active_user)) -> Any:
    """
    Refresh access token.

    Args:
        current_user (User): Current authenticated user

    Returns:
        dict: New access token and token type
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        subject=current_user.email,
        role=current_user.role,
        expires_delta=access_token_expires,
    )

    return {"access_token": token, "token_type": "bearer"}
