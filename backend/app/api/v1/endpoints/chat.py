# backend/app/api/v1/endpoints/chat.py
from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.auth import get_current_active_user
from app.database.models import User
from app.services.chat_service import ChatService
from app.services.guest_chat_service import GuestChatService

router = APIRouter()
chat_service = ChatService()
guest_chat_service = GuestChatService()


class ChatRequest(BaseModel):
    """Chat request model."""

    prompt: str


class ChatResponse(BaseModel):
    """Chat response model."""

    response: str


@router.post("/", response_model=ChatResponse)
def chat_with_ai(
    request: ChatRequest, current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Chat with the AI assistant.

    Args:
        request (ChatRequest): Chat request with user prompt
        current_user (User): Current authenticated user

    Returns:
        dict: AI response
    """
    if not request.prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Prompt cannot be empty"
        )

    result = chat_service.generate_response(request.prompt)

    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate response from AI",
        )

    return {"response": result["response"]}


@router.post("/guest", response_model=ChatResponse)
def chat_with_ai_guest(request: ChatRequest) -> Any:
    """
    Chat with the AI assistant without authentication.

    Args:
        request (ChatRequest): Chat request with user prompt

    Returns:
        dict: AI response
    """
    if not request.prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Prompt cannot be empty"
        )

    result = guest_chat_service.generate_response(request.prompt)

    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate response from AI",
        )

    return {"response": result["response"]}