import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import SubmissionDetail from "../components/submissions/SubmissionDetail";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import submissionService from "../services/submissionService";

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regradingLoading, setRegradingLoading] = useState(false);
  const [regradingSuccess, setRegradingSuccess] = useState(false);
  const [acceptingLoading, setAcceptingLoading] = useState(false);
  const [acceptingSuccess, setAcceptingSuccess] = useState(false);

  const isProfessor = currentUser?.role === "professor";

  // Fetch submission
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const data = await submissionService.getSubmissionById(id);
        setSubmission(data);
      } catch (error) {
        console.error("Error fetching submission:", error);
        setError("Failed to load submission. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  // Handle regrading (professors only)
  const handleRegrade = async (submissionId) => {
    if (!isProfessor) return;

    try {
      setRegradingLoading(true);
      setRegradingSuccess(false);
      setAcceptingSuccess(false);

      // Default to Medium strictness
      const updatedSubmission = await submissionService.gradeSubmission(
        submissionId,
        "Medium"
      );

      setSubmission(updatedSubmission);
      setRegradingSuccess(true);

      // Clear success message after a delay
      setTimeout(() => {
        setRegradingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error regrading submission:", error);
      setError("Failed to regrade submission. Please try again later.");
    } finally {
      setRegradingLoading(false);
    }
  };

  // Handle accepting grade (professors only)
  const handleAcceptGrade = async (submissionId) => {
    if (!isProfessor) return;

    try {
      setAcceptingLoading(true);
      setAcceptingSuccess(false);
      setRegradingSuccess(false);

      const updatedSubmission = await submissionService.acceptSubmissionGrade(
        submissionId
      );

      setSubmission(updatedSubmission);
      setAcceptingSuccess(true);

      // Clear success message after a delay
      setTimeout(() => {
        setAcceptingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error accepting grade:", error);
      setError("Failed to accept grade. Please try again later.");
    } finally {
      setAcceptingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 flex justify-center items-center pt-16 md:pt-4">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4">
          <Alert type="error" message={error} />
          <div className="mt-6">
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4">
          <Alert type="error" message="Submission not found" />
          <div className="mt-6">
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4">
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {regradingSuccess && (
          <Alert
            type="success"
            message="Regrading initiated successfully! Refresh in a few moments to see updated feedback."
            className="mb-4"
          />
        )}

        {acceptingSuccess && (
          <Alert
            type="success"
            message="Grade has been accepted! The student will now see the accepted status."
            className="mb-4"
          />
        )}

        <SubmissionDetail
          submission={submission}
          onRegrade={handleRegrade}
          onAccept={handleAcceptGrade}
        />
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
