import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import submissionService from "../services/submissionService";
import assignmentService from "../services/assignmentService";

const SubmissionsPage = () => {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState("all");
  const navigate = useNavigate();

  // Fetch user's submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await submissionService.getSubmissions();
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError("Failed to load submissions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Fetch assignments for the filter
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getAllAssignments();
        setAssignments(data.assignments || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        // Don't show error for assignments filter
      }
    };

    fetchAssignments();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      submitted: "bg-yellow-100 text-yellow-800",
      graded: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      resubmitted: "bg-purple-100 text-purple-800",
    };

    const statusText = {
      submitted: "Pending",
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

  const handleViewSubmission = (submissionId) => {
    navigate(`/submissions/${submissionId}`);
  };

  const filteredSubmissions =
    selectedAssignment === "all"
      ? submissions
      : submissions.filter(
          (sub) => sub.assignment_id === parseInt(selectedAssignment)
        );

  // Format date for better display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Submissions
        </h1>

        {/* Filter Section */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0 w-full sm:w-auto">
              <h3 className="text-lg font-semibold text-gray-800">
                Filter Submissions
              </h3>
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="input-field w-full sm:w-auto min-w-[200px]"
              >
                <option value="all">All Assignments</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Submissions List - Now with responsive cards for mobile */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : filteredSubmissions.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-600 mb-4">
              {selectedAssignment === "all"
                ? "You haven't submitted any assignments yet."
                : "No submissions found for this assignment."}
            </p>
            <Button onClick={() => navigate("/assignments")}>
              View Available Assignments
            </Button>
          </Card>
        ) : (
          <div>
            {/* Hide table on mobile, show cards instead */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
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
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-800">
                          {submission.assignment_title ||
                            "Assignment Submission"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Attempt #{submission.attempt_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-600">
                          {formatDate(submission.submission_time)}
                          {submission.is_late && (
                            <span className="ml-2 text-xs text-red-600 font-medium">
                              (Late)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-600">
                          {submission.feedback?.score !== undefined ? (
                            <span className="font-medium">
                              {submission.feedback.score}
                            </span>
                          ) : (
                            <span className="text-gray-500">Pending</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          size="sm"
                          onClick={() => handleViewSubmission(submission.id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view - Cards instead of table */}
            <div className="md:hidden space-y-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {submission.assignment_title ||
                            "Assignment Submission"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Attempt #{submission.attempt_number}
                        </p>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>

                    <div className="flex justify-between items-center text-sm mb-3">
                      <div className="text-gray-600">
                        <span>
                          Submitted: {formatDate(submission.submission_time)}
                        </span>
                        {submission.is_late && (
                          <span className="ml-2 text-xs text-red-600 font-medium">
                            (Late)
                          </span>
                        )}
                      </div>
                      <div className="text-gray-700 font-medium">
                        {submission.feedback?.score !== undefined ? (
                          <span>Score: {submission.feedback.score}</span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleViewSubmission(submission.id)}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;
