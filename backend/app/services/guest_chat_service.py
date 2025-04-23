# backend/app/services/chat_service.py
import json
from typing import Dict, Any
import os
from google import genai
from google.genai import types


class GuestChatService:
    """Service for interacting with Google's Gemini API for chat functionality."""

    def __init__(self):
        """Initialize Gemini API client."""
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        self.client = genai.Client(api_key=api_key)

    def generate_response(self, prompt: str) -> Dict[str, Any]:
        """
        Generate a chat response using Gemini API.

        Args:
            prompt (str): User's prompt

        Returns:
            Dict[str, Any]: Response from the model
        """
        model = "gemini-2.0-flash-lite"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
            system_instruction=types.Content(
                role="system",
                parts=[
                    types.Part.from_text(
                        text="""SYSTEM PROMPT:

SYSTEM PROMPT:

You are Neuron, an AI assistant for the GRADiEnt educational platform. When speaking with guest users (not logged in), your role is to provide general information about the platform and answer frequently asked questions.

For guest users, you should:

1. Provide clear information about what GRADiEnt is and how it works
2. Explain the AI-powered feedback system that helps students improve their work
3. Answer questions about registration processes for both students and professors
4. Describe the platform's terms of service and privacy policy in general terms
5. Direct users to appropriate contact channels for support
6. Explain the benefits of the platform for both students and educators

Topics you can discuss with guests include:
- General overview of GRADiEnt's features and benefits
- How the AI grading and feedback system works in general terms
- Registration and account creation processes
- Differences between student and professor accounts
- Platform accessibility and technical requirements
- Terms of service and privacy policy information
- Support channels and contact information

When guests ask about accessing learning materials or submitting assignments, politely explain that these features require registration and login.

Maintain a helpful, informative tone while encouraging guests to register for full access to the platform's educational features.

Key information to share with guests:
- GRADiEnt is an educational platform that provides AI-powered instant feedback
- The platform allows for course registration, assignment submission, and automated grading
- Students receive detailed feedback with specific improvement suggestions
- Professors can review AI-generated feedback before finalizing grades
- Registration is simple and can be completed online through the platform
- Both students and professors can benefit from the streamlined workflow
- Support is available through email, contact form, and help center resources"""
                    ),
                ],
            ),
        )
        try:
            response = self.client.models.generate_content(
                model=model,
                contents=contents,
                config=generate_content_config,
            )
            return {"response": response.text, "success": True}
        except Exception as e:
            # Log the error and return an error response
            print(f"Error generating content: {e}")
            return {
                "response": "I'm sorry, I encountered an error while processing your question. Please try again later.",
                "success": False,
                "error": str(e),
            }
