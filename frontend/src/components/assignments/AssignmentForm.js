import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assignmentService from "../../services/assignmentService";
import Alert from "../common/Alert";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";
import Card from "../common/Card";

const AssignmentForm = ({ courseId, assignmentId = null, onCancel }) => {
  const [formData, setFormData] = useState({
    course_id: courseId,
    title: "",
    description: "",
    assignment_type: "essay",
    due_date: "",
    points_possible: 50,
    allow_resubmissions: false,
    resubmission_deadline: "",
    reference_solution: "",
  });

  const [referenceFile, setReferenceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasReferenceSolution, setHasReferenceSolution] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (assignmentId) {
      setIsEditing(true);
      fetchAssignment();
    } else if (courseId) {
      setFormData((prev) => ({ ...prev, course_id: courseId }));
    }
  }, [assignmentId, courseId]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const assignmentData = await assignmentService.getAssignmentById(
        assignmentId
      );

      // Format date for input field (YYYY-MM-DDTHH:MM)
      let dueDate = "";
      let resubDate = "";

      if (assignmentData.due_date) {
        dueDate = new Date(assignmentData.due_date).toISOString().slice(0, 16);
      }

      if (assignmentData.resubmission_deadline) {
        resubDate = new Date(assignmentData.resubmission_deadline)
          .toISOString()
          .slice(0, 16);
      }

      setFormData({
        course_id: assignmentData.course_id,
        title: assignmentData.title,
        description: assignmentData.description || "",
        assignment_type: assignmentData.assignment_type,
        due_date: dueDate,
        points_possible: assignmentData.points_possible,
        allow_resubmissions: assignmentData.allow_resubmissions,
        resubmission_deadline: resubDate,
        reference_solution: assignmentData.reference_solution || "",
      });

      setHasReferenceSolution(
        !!assignmentData.reference_solution ||
          !!assignmentData.reference_solution_file_path
      );
    } catch (error) {
      console.error("Error fetching assignment:", error);
      setError("Failed to load assignment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.title) {
      setError("Title is required");
      return;
    }

    if (!formData.due_date) {
      setError("Due date is required");
      return;
    }

    if (formData.allow_resubmissions && !formData.resubmission_deadline) {
      setError(
        "Resubmission deadline is required when resubmissions are allowed"
      );
      return;
    }

    // Validate that resubmission deadline is after due date
    if (formData.allow_resubmissions && formData.resubmission_deadline) {
      const dueDate = new Date(formData.due_date);
      const resubDate = new Date(formData.resubmission_deadline);

      if (resubDate <= dueDate) {
        setError("Resubmission deadline must be after the due date");
        return;
      }
    }

    try {
      setLoading(true);

      // Prepare data - Create a copy of the form data
      const assignmentData = { ...formData };

      // If resubmissions are not allowed, remove the resubmission_deadline field entirely
      if (!assignmentData.allow_resubmissions) {
        delete assignmentData.resubmission_deadline;
      }

      if (isEditing) {
        await assignmentService.updateAssignment(
          assignmentId,
          assignmentData,
          referenceFile
        );
        setSuccess("Assignment updated successfully!");
      } else {
        await assignmentService.createAssignment(assignmentData, referenceFile);
        setSuccess("Assignment created successfully!");
      }

      // Redirect to assignments page after a delay
      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 1500);
    } catch (error) {
      console.error("Error saving assignment:", error);

      // Improved error handling - Convert complex error objects to strings
      let errorMessage = "Failed to save assignment. Please try again.";

      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          if (typeof error.response.data.detail === "string") {
            errorMessage = error.response.data.detail;
          } else if (Array.isArray(error.response.data.detail)) {
            // Handle validation error array
            errorMessage = error.response.data.detail
              .map((err) => {
                if (typeof err === "object" && err.msg) {
                  return `${err.loc?.join(".") || ""}: ${err.msg}`;
                }
                return String(err);
              })
              .join(", ");
          } else if (typeof error.response.data.detail === "object") {
            // Handle validation error object
            errorMessage = Object.entries(error.response.data.detail)
              .map(([key, value]) => `${key}: ${String(value)}`)
              .join(", ");
          }
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={isEditing ? "Edit Assignment" : "Create Assignment"}>
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="input-label">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="input-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="assignment_type" className="input-label">
              Assignment Type
            </label>
            <select
              id="assignment_type"
              name="assignment_type"
              value={formData.assignment_type}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
              required
            >
              <option value="essay">Essay</option>
              <option value="code">Code</option>
              <option value="presentation">Presentation</option>
              <option value="quiz">Quiz</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="points_possible" className="input-label">
              Points Possible
            </label>
            <input
              id="points_possible"
              name="points_possible"
              type="number"
              min="1"
              value={formData.points_possible}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="due_date" className="input-label">
              Due Date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-center mt-6">
            <input
              id="allow_resubmissions"
              name="allow_resubmissions"
              type="checkbox"
              checked={formData.allow_resubmissions}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="allow_resubmissions" className="ml-2">
              Allow Resubmissions
            </label>
          </div>

          {formData.allow_resubmissions && (
            <div>
              <label htmlFor="resubmission_deadline" className="input-label">
                Resubmission Deadline
              </label>
              <input
                id="resubmission_deadline"
                name="resubmission_deadline"
                type="datetime-local"
                value={formData.resubmission_deadline}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
                required={formData.allow_resubmissions}
              />
            </div>
          )}

          <div className="md:col-span-2 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Reference Solution</h3>
            <p className="text-gray-600 text-sm mb-4">
              This will be used for automated grading. Only visible to
              professors.
            </p>

            <div className="mb-4">
              <label htmlFor="reference_solution" className="input-label">
                Reference Solution Code
              </label>
              <textarea
                id="reference_solution"
                name="reference_solution"
                rows="8"
                value={formData.reference_solution}
                onChange={handleChange}
                className="input-field font-mono"
                placeholder="# Paste reference solution code here"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reference_file" className="input-label">
                Or Upload Reference Solution File
              </label>
              <input
                id="reference_file"
                name="reference_file"
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
              {isEditing && hasReferenceSolution && !referenceFile && (
                <p className="mt-2 text-sm text-gray-600">
                  A reference solution is already uploaded. Upload a new file to
                  replace it.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <GradientButton type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Assignment"
              : "Create Assignment"}
          </GradientButton>
        </div>
      </form>
    </Card>
  );
};

export default AssignmentForm;
