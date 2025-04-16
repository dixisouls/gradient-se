import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../common/Card";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";

const SubmissionDetail = ({ submission, onRegrade }) => {
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
      graded: "bg-green-100 text-green-800",
      resubmitted: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Card gradientBorder>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">
              Submission Details
            </h2>
            {getStatusBadge(submission.status)}
          </div>
          <p className="text-gray-600 mt-1">
            Submitted on {formatDate(submission.submission_time)}
            {submission.is_late && (
              <span className="ml-2 text-red-600 font-medium">(Late)</span>
            )}
          </p>
        </div>

        {isProfessor && (
          <div>
            <Button onClick={() => onRegrade(submission.id)} variant="outline">
              Regrade Submission
            </Button>
          </div>
        )}
      </div>

      {/* Submission Content */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Submission</h3>

        {submission.submission_text ? (
          <div className="bg-gray-50 p-4 rounded-md font-mono whitespace-pre-wrap">
            {submission.submission_text}
          </div>
        ) : submission.file_name ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 mb-2">
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Overall Assessment
            </h3>
            <div className="bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 p-4 rounded-md">
              <p className="text-gray-700">
                {submission.feedback.overall_assessment}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Improvement Suggestions
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="list-disc ml-6 space-y-2">
                {submission.feedback.improvement_suggestions.map(
                  (suggestion, index) => (
                    <li key={index} className="text-gray-700">
                      {suggestion}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-2xl font-bold text-gradient-primary">
                {submission.feedback.score}
              </p>
            </div>

            {submission.feedback.similarity_score !== null && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Solution Similarity</p>
                <p className="text-2xl font-bold text-gradient-secondary">
                  {submission.feedback.similarity_score}%
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <p className="text-yellow-700">
            This submission is currently being graded. Refresh the page in a few
            moments to see the feedback.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Link to="..">
          <Button variant="outline">Back</Button>
        </Link>

        {submission.feedback && (
          <GradientButton>Download Feedback</GradientButton>
        )}
      </div>
    </Card>
  );
};

export default SubmissionDetail;
