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

  const handleViewSubmission = (submissionId) => {
    navigate(`/submissions/${submissionId}`);
  };

  const filteredSubmissions =
    selectedAssignment === "all"
      ? submissions
      : submissions.filter(
          (sub) => sub.assignment_id === parseInt(selectedAssignment)
        );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Submissions
        </h1>

        {/* Filter Section */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">
                Filter Submissions
              </h3>
            </div>
            <div>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="input-field min-w-[200px]"
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

        {/* Submissions List */}
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
          <div className="overflow-x-auto">
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
                        {submission.assignment_title || "Assignment Submission"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Attempt #{submission.attempt_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">
                        {new Date(
                          submission.submission_time
                        ).toLocaleDateString()}
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
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;
