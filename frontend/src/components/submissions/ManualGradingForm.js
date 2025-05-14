// frontend/src/components/submissions/ManualGradingForm.js
import React, { useState } from "react";
import Alert from "../common/Alert";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";

const ManualGradingForm = ({ submission, assignment, onSubmit, onCancel }) => {
  const [grade, setGrade] = useState(
    submission.feedback?.final_grade || submission.feedback?.score || ""
  );
  const [feedbackText, setFeedbackText] = useState(
    submission.feedback?.professor_comments || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate grade
    const numGrade = parseFloat(grade);
    if (
      isNaN(numGrade) ||
      numGrade < 0 ||
      numGrade > assignment.points_possible
    ) {
      setError(
        `Grade must be a number between 0 and ${assignment.points_possible}`
      );
      return;
    }

    if (!feedbackText.trim()) {
      setError("Please provide feedback");
      return;
    }

    onSubmit(numGrade, feedbackText);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Manual Grading
      </h3>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError("")}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="grade"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Grade (out of {assignment.points_possible})
          </label>
          <input
            id="grade"
            type="number"
            min="0"
            max={assignment.points_possible}
            step="0.1"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Feedback
          </label>
          <textarea
            id="feedback"
            rows="6"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide detailed feedback for the student..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <GradientButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Grade"}
          </GradientButton>
        </div>
      </form>
    </div>
  );
};

export default ManualGradingForm;
