import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../common/Card";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";

const SubmissionDetail = ({ submission, onRegrade, onAccept }) => {
  const { currentUser } = useAuth();
  const isProfessor = currentUser?.role === "professor";

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusClasses = {
      submitted: "bg-yellow-100 text-yellow-800",
      graded: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      resubmitted: "bg-purple-100 text-purple-800",
    };

    const statusText = {
      submitted: "Submitted",
      graded: "Graded (Needs Review)",
      accepted: "Accepted",
      resubmitted: "Resubmitted",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusText[status] || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Check if the submission needs professor review
  const needsReview =
    isProfessor &&
    submission.status === "graded" &&
    !submission.feedback?.professor_review;

  return (
    <Card gradientBorder>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Submission Details
              </h2>
              {getStatusBadge(submission.status)}
            </div>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Submitted on {formatDate(submission.submission_time)}
              {submission.is_late && (
                <span className="ml-2 text-red-600 font-medium">(Late)</span>
              )}
            </p>
          </div>

          {isProfessor && (
            <div className="flex flex-wrap gap-2">
              {needsReview ? (
                <>
                  <Button
                    onClick={() => onAccept(submission.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Accept Grade
                  </Button>
                  <Button
                    onClick={() => onRegrade(submission.id)}
                    variant="outline"
                    size="sm"
                  >
                    Decline & Regrade
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => onRegrade(submission.id)}
                  variant="outline"
                  size="sm"
                >
                  Regrade Submission
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submission Content */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          Submission
        </h3>

        {submission.submission_text ? (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-md font-mono whitespace-pre-wrap text-sm overflow-x-auto">
            {submission.submission_text}
          </div>
        ) : submission.file_name ? (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Submitted file: {submission.file_name}
            </p>
            <Button size="sm">Download Submission</Button>
          </div>
        ) : (
          <p className="text-gray-600 italic">
            No submission content available
          </p>
        )}
      </div>

      {/* Feedback Section */}
      {submission.feedback ? (
        <div>
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Overall Assessment
            </h3>
            <div className="bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 p-3 sm:p-4 rounded-md">
              <p className="text-gray-700 text-sm sm:text-base">
                {submission.feedback.overall_assessment}
              </p>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Improvement Suggestions
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
              <ul className="list-disc ml-4 sm:ml-6 space-y-2">
                {submission.feedback.improvement_suggestions.map(
                  (suggestion, index) => (
                    <li
                      key={index}
                      className="text-gray-700 text-sm sm:text-base"
                    >
                      {suggestion}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-xl sm:text-2xl font-bold text-gradient-primary">
                {submission.feedback.score}
              </p>
            </div>

            {submission.feedback.similarity_score !== null && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
                <p className="text-sm text-gray-500">Solution Similarity</p>
                <p className="text-xl sm:text-2xl font-bold text-gradient-secondary">
                  {submission.feedback.similarity_score}%
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-3 sm:p-4 rounded-md mb-6">
          <p className="text-yellow-700 text-sm sm:text-base">
            This submission is currently being graded. Refresh the page in a few
            moments to see the feedback.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
        <Link to=".." className="w-full sm:w-auto">
          <Button variant="outline" fullWidth={window.innerWidth < 640}>
            Back
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default SubmissionDetail;
