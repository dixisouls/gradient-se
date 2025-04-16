import React from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import Card from "../common/Card";

const SubmissionList = ({ submissions, assignmentTitle }) => {
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
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
      graded: "Graded",
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

  return (
    <Card
      title={
        assignmentTitle
          ? `Submissions for ${assignmentTitle}`
          : "Your Submissions"
      }
    >
      {submissions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No submissions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attempt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(submission.submission_time)}
                    </div>
                    {submission.is_late && (
                      <div className="text-xs text-red-600">Late</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      #{submission.attempt_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(submission.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {submission.feedback?.score !== undefined ? (
                        <span className="font-medium">
                          {submission.feedback.score}
                        </span>
                      ) : (
                        <span className="text-gray-500">Pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/submissions/${submission.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default SubmissionList;
