import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import GradientButton from "../components/common/GradientButton";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";
import submissionService from "../services/submissionService";
import assignmentService from "../services/assignmentService";

const GradingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState("all");

  useEffect(() => {
    // Only professors can access this page
    if (currentUser?.role !== "professor") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Fetch all submissions
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

  // Apply filters
  const filteredSubmissions = submissions.filter((submission) => {
    // Filter by assignment
    if (
      selectedAssignment !== "all" &&
      submission.assignment_id !== parseInt(selectedAssignment)
    ) {
      return false;
    }

    // Filter by status
    if (filter === "pending_ai" && submission.status !== "submitted") {
      return false;
    }
    if (
      filter === "pending_review" &&
      (submission.status !== "graded" ||
        !submission.feedback ||
        submission.feedback.professor_review)
    ) {
      return false;
    }
    if (
      filter === "completed" &&
      (!submission.feedback || !submission.feedback.professor_review)
    ) {
      return false;
    }

    return true;
  });

  const getPendingAICount = () => {
    return submissions.filter((sub) => sub.status === "submitted").length;
  };

  const getPendingReviewCount = () => {
    return submissions.filter(
      (sub) =>
        sub.status === "graded" &&
        sub.feedback &&
        !sub.feedback.professor_review
    ).length;
  };

  const getCompletedCount = () => {
    return submissions.filter(
      (sub) => sub.feedback && sub.feedback.professor_review
    ).length;
  };

  const handleViewSubmission = (submissionId) => {
    navigate(`/submissions/${submissionId}`);
  };

  const handleRegradingAction = async (submissionId) => {
    try {
      await submissionService.gradeSubmission(submissionId, "Medium");
      alert("Regrading initiated successfully!");

      // Update the submission in the list
      const updatedSubmissions = submissions.map((sub) =>
        sub.id === submissionId ? { ...sub, status: "submitted" } : sub
      );
      setSubmissions(updatedSubmissions);
    } catch (error) {
      console.error("Error regrading submission:", error);
      alert("Failed to initiate regrading. Please try again.");
    }
  };

  const getStatusBadge = (submission) => {
    if (submission.status === "submitted") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          Pending AI Grading
        </span>
      );
    } else if (submission.status === "graded") {
      if (!submission.feedback?.professor_review) {
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Needs Review
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Completed
          </span>
        );
      }
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
          {submission.status.charAt(0).toUpperCase() +
            submission.status.slice(1)}
        </span>
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Grading Center
        </h1>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-xl font-semibold text-gray-800">
                  Filter Submissions
                </h3>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Assignments</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={filter === "all" ? "primary" : "outline"}
                    onClick={() => setFilter("all")}
                  >
                    All ({submissions.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === "pending_ai" ? "primary" : "outline"}
                    onClick={() => setFilter("pending_ai")}
                  >
                    Pending AI ({getPendingAICount()})
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      filter === "pending_review" ? "primary" : "outline"
                    }
                    onClick={() => setFilter("pending_review")}
                  >
                    Needs Review ({getPendingReviewCount()})
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === "completed" ? "primary" : "outline"}
                    onClick={() => setFilter("completed")}
                  >
                    Completed ({getCompletedCount()})
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

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
              No submissions match the current filter.
            </p>
            <Button onClick={() => setFilter("all")}>
              View All Submissions
            </Button>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
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
                    AI Score
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
                        {submission.student_name || "Student"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.student_email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-800">
                        {submission.assignment_title || "Assignment"}
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
                      {getStatusBadge(submission)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">
                        {submission.feedback?.score !== undefined
                          ? submission.feedback.score
                          : "Pending"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleViewSubmission(submission.id)}
                        >
                          {submission.status === "graded" &&
                          !submission.feedback?.professor_review
                            ? "Review"
                            : "View"}
                        </Button>

                        {submission.status === "graded" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRegradingAction(submission.id)}
                          >
                            Regrade
                          </Button>
                        )}
                      </div>
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

export default GradingPage;
