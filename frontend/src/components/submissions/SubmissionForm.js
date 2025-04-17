import React, { useState } from "react";
import submissionService from "../../services/submissionService";
import Alert from "../common/Alert";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";
import Card from "../common/Card";

const SubmissionForm = ({
  assignmentId,
  onSubmitted,
  assignmentType = "code",
}) => {
  const [submissionText, setSubmissionText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submittingMethod, setSubmittingMethod] = useState("text"); // "text" or "file"

  const handleSubmissionTextChange = (e) => {
    setSubmissionText(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (submittingMethod === "text" && !submissionText.trim()) {
      setError("Please enter your submission text");
      return;
    }

    if (submittingMethod === "file" && !file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);

      // Submit based on selected method
      const response = await submissionService.createSubmission(
        assignmentId,
        submittingMethod === "text" ? submissionText : null,
        submittingMethod === "file" ? file : null
      );

      setSuccess(
        "Assignment submitted successfully! Your submission is being graded."
      );

      // Clear form
      setSubmissionText("");
      setFile(null);

      // Call the callback if provided
      if (onSubmitted) {
        onSubmitted(response);
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to submit assignment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Submit Assignment">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-sm ${
                submittingMethod === "text"
                  ? "bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSubmittingMethod("text")}
            >
              Write Code
            </button>
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-sm ${
                submittingMethod === "file"
                  ? "bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSubmittingMethod("file")}
            >
              Upload File
            </button>
          </div>

          {submittingMethod === "text" && (
            <div>
              <label htmlFor="submissionText" className="input-label">
                Your Solution
              </label>
              <textarea
                id="submissionText"
                value={submissionText}
                onChange={handleSubmissionTextChange}
                className="input-field font-mono text-sm"
                rows="12"
                placeholder={
                  assignmentType === "code"
                    ? "# Enter your code here"
                    : "Enter your answer here"
                }
                disabled={loading}
              />
            </div>
          )}

          {submittingMethod === "file" && (
            <div>
              <label htmlFor="file" className="input-label">
                Upload Your Solution
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                disabled={loading}
              />
              {file && (
                <p className="mt-2 text-sm text-green-600">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <GradientButton
            type="submit"
            disabled={loading}
            fullWidth={window.innerWidth < 640}
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </GradientButton>
        </div>
      </form>
    </Card>
  );
};

export default SubmissionForm;
