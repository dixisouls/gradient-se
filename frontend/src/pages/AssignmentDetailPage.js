import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import GradientButton from "../components/common/GradientButton";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";
import SubmissionForm from "../components/submissions/SubmissionForm";
import SubmissionList from "../components/submissions/SubmissionList";
import assignmentService from "../services/assignmentService";
import submissionService from "../services/submissionService";

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const isProfessor = currentUser?.role === "professor";

  // Fetch assignment data
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getAssignmentById(id);
        setAssignment(data);
      } catch (error) {
        console.error("Error fetching assignment:", error);
        setError("Failed to load assignment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!assignment) return;

      try {
        setSubmissionsLoading(true);
        const data = await submissionService.getSubmissions({
          assignmentId: id,
        });
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        // Don't set an error for submissions - we'll just show an empty list
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchSubmissions();
  }, [id, assignment]);

  // Handle submission creation
  const handleSubmissionCreated = (submission) => {
    setSubmissions((prev) => [submission, ...prev]);
    setShowSubmissionForm(false);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  // Check if past due
  const isPastDue = () => {
    if (!assignment?.due_date) return false;
    return new Date() > new Date(assignment.due_date);
  };

  // Determine if student can submit
  const canSubmit = () => {
    if (isProfessor) return false;
    if (isPastDue()) {
      // Check if resubmissions are allowed
      if (!assignment.allow_resubmissions) return false;
      if (new Date() > new Date(assignment.resubmission_deadline)) return false;
      // Only allow resubmissions if there is at least one submission
      return submissions.length > 0;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 flex justify-center items-center">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <Alert type="error" message={error} />
          <div className="mt-6">
            <Button onClick={() => navigate("/assignments")}>
              Back to Assignments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <Alert type="error" message="Assignment not found" />
          <div className="mt-6">
            <Button onClick={() => navigate("/assignments")}>
              Back to Assignments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/assignments")}
          >
            Back to Assignments
          </Button>
        </div>

        {/* Assignment Details */}
        <Card gradientBorder className="mb-8">
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {assignment.title}
                </h1>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                    {assignment.assignment_type}
                  </span>

                  {isPastDue() ? (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Past Due
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Open
                    </span>
                  )}
                </div>
              </div>

              {isProfessor && (
                <Button onClick={() => navigate(`/assignments/${id}/edit`)}>
                  Edit Assignment
                </Button>
              )}
            </div>
          </div>

          {assignment.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {assignment.description}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Points Possible</p>
              <p className="font-medium text-gray-800">
                {assignment.points_possible}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-medium text-gray-800">
                {formatDate(assignment.due_date)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Resubmissions</p>
              <p className="font-medium text-gray-800">
                {assignment.allow_resubmissions ? (
                  <>
                    Allowed until {formatDate(assignment.resubmission_deadline)}
                  </>
                ) : (
                  "Not allowed"
                )}
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          {canSubmit() && (
            <div className="mt-6">
              <GradientButton onClick={() => setShowSubmissionForm(true)}>
                {submissions.length > 0
                  ? "Submit New Attempt"
                  : "Submit Assignment"}
              </GradientButton>
            </div>
          )}

          {isPastDue() && !canSubmit() && !isProfessor && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md mt-6">
              <p className="text-red-800">
                This assignment is past due and no longer accepting submissions.
              </p>
            </div>
          )}
        </Card>

        {/* Submission Form */}
        {showSubmissionForm && (
          <div className="mb-8">
            <SubmissionForm
              assignmentId={id}
              assignmentType={assignment.assignment_type}
              onSubmitted={handleSubmissionCreated}
            />
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSubmissionForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Submissions List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isProfessor ? "Student Submissions" : "Your Submissions"}
          </h2>

          {submissionsLoading ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : (
            <SubmissionList submissions={submissions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
