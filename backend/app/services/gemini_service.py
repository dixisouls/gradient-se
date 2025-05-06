# backend/app/services/gemini_service.py
import json
from typing import Dict, Any, Optional
import os
from google import genai
from google.genai import types


class GeminiService:
    """Service for interacting with Google's Gemini API."""

    def __init__(self):
        """Initialize Gemini API client."""
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        self.client = genai.Client(api_key=api_key)

    def grade_submission(
        self,
        student_submission: str,
        reference_solution: Optional[str] = None,
        grading_rubric: Optional[str] = None,
        total_points: int = 100,
        strictness: str = "Medium",
    ) -> Dict[str, Any]:
        model = "gemini-2.0-flash"

        # Prepare the prompt with appropriate formatting
        prompt_data = {
            "student_submission": student_submission,
            "total_points_possible": total_points,
            "grading_strictness": strictness,
        }

        # Add optional components if provided
        if reference_solution:
            prompt_data["reference_solution"] = reference_solution
        if grading_rubric:
            prompt_data["grading_rubric"] = grading_rubric

        prompt_json = json.dumps(prompt_data)

        # Create conversation with system prompt
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text="""You are GradingAssistant, an AI that evaluates coding assignments. Your task is to provide concise, helpful feedback on student code submissions based on the following inputs:

## Input Components:
1. **Student Code Submission** (required)
2. **Reference Solution** (optional)
3. **Grading Rubric** (optional)
4. **Total Points Possible** (required)
5. **Grading Strictness** (required): Easy (lenient), Medium (standard), or Strict (rigorous)

## Evaluation Focus:
- Functional correctness
- Logic implementation
- Code syntax
- Edge case handling

Do NOT focus heavily on variable naming conventions unless severely problematic.
IMPORTANT: Try to match it with the reference solution, sometimes the code might be inefficient but thats what the professor wants. Compare it with reference solution and not with production standards unless specified in the grading rubric.

## Output Format (Keep it brief and focused):

1. **Overall Assessment** (1 paragraph only):
   - Brief evaluation of the submission's quality and how well it meets requirements

2. **Improvement Suggestions** (3-5 bullet points maximum):
   - Specific, actionable recommendations
   - Include line number references where applicable
   - Brief explanation of why each change would improve the code
3. **Score**: This should be the score, you score the assignment, out of the total possible points given to you. If total possible points are 50, score out of 50, if it is 10, out of 10. Don't return 8/10 or 40/50, just the score as 8 or 40.

4. **Similarity Score**: Give a similarity score out of 100. This should show how similar is the submitted solution to the professor given reference solution. If no solution is given, don't give this score. Again return in X form, not X/Y form.

## Grading Strictness Guidelines:

- **Easy**: Focus mainly on correct outputs; be generous with partial credit
- **Medium**: Balance correctness with good coding practices; reasonable deductions for inefficiencies
- **Strict**: Expect comprehensive test case handling and optimal approaches; limited partial credit

Maintain a constructive, educational tone that helps students improve while providing fair evaluation.
Return only one feedback for each submission.
Do no refer to the reference solution, return feedback based on the student submission and grading rubric. Do not mention the grading rubric in the feedback.
Never mention the reference solution, grade as you are the professor and the student has submitted the assignment to you.
The input will be provided to you in json form maintaining the input structure given above."""
                    ),
                ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(
                        text="""{
  \"overall_assessment\": \"The submission demonstrates a good understanding of the core logic required to solve the problem. The code appears functional, but may benefit from minor adjustments to enhance efficiency and readability, aligning it closer to the reference solution.\",
  \"improvement_suggestions\": [
    \"Consider restructuring the conditional logic (e.g., if/else statements) to mirror the order in the reference solution. This might improve maintainability. Refer to lines [relevant line numbers].\",
    \"Explore opportunities to reduce redundancy in calculations by storing intermediate results in variables, as demonstrated in the reference solution. See lines [relevant line numbers].\",
    \"Ensure that edge cases are handled gracefully, as the reference solution provides. Specifically, consider testing with null or very large input values, adding validation on lines [relevant line numbers].\",
    \"Review the overall code structure to better match the reference solution's organization, potentially improving readability and consistency. Focus on lines [relevant line numbers].\\"
  ],
  \"score\": 0,
  \"similarity_score\": 0
}"""
                    ),
                ],
            ),
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt_json),
                ],
            ),
        ]

        generate_content_config = types.GenerateContentConfig(
            response_mime_type="application/json",
        )

        try:
            response = self.client.models.generate_content(
                model=model,
                contents=contents,
                config=generate_content_config,
            )
            # Parse the response as JSON
            feedback = json.loads(response.text)
            return feedback
        except Exception as e:
            # Log the error and return a default response
            print(f"Error generating content: {e}")
            return {
                "overall_assessment": "Error generating feedback.",
                "improvement_suggestions": [
                    "There was an error generating feedback. Please try again later."
                ],
                "score": 0,
                "similarity_score": 0 if reference_solution else None,
                "error": str(e),
            }
