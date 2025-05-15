import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import Button from "../common/Button";

const CourseForm = ({ courseId = null, onCancel }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    term: "Spring 2025", // Default term
    professor_id: "", // New field for professor selection
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [availableProfessors, setAvailableProfessors] = useState([]);

  const navigate = useNavigate();

  // Fetch course data for editing
  useEffect(() => {
    if (courseId) {
      setIsEditing(true);

      const fetchCourse = async () => {
        try {
          setLoading(true);
          const courseData = await courseService.getCourseById(courseId);
          setFormData({
            code: courseData.code,
            name: courseData.name,
            description: courseData.description || "",
            term: courseData.term,
            // If professor data is available, set the first professor's ID
            professor_id:
              courseData.professors && courseData.professors.length > 0
                ? courseData.professors[0].id.toString()
                : "",
          });
        } catch (error) {
          console.error("Error fetching course:", error);
          setError("Failed to load course data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [courseId]);

  // Fetch available professors
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const professors = await courseService.getAvailableProfessors();
        setAvailableProfessors(professors || []);
      } catch (error) {
        console.error("Error fetching professors:", error);
        setError(
          "Failed to load available professors. Please try again later."
        );
      }
    };

    fetchProfessors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form data
    if (!formData.code || !formData.name || !formData.term) {
      setError("Please fill all required fields");
      return;
    }

    // Validate professor selection for new courses
    if (!isEditing && !formData.professor_id) {
      setError("Please select a professor for this course");
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        // Only include fields that are allowed to be updated
        const updateData = {
          name: formData.name,
          description: formData.description,
          term: formData.term,
          // Include professor_id in updates if it's set
          ...(formData.professor_id && {
            professor_id: parseInt(formData.professor_id),
          }),
        };

        await courseService.updateCourse(courseId, updateData);
        setSuccess("Course updated successfully!");
      } else {
        // For new courses, include the professor_id
        const createData = {
          ...formData,
          professor_id: parseInt(formData.professor_id),
        };

        await courseService.createCourse(createData);
        setSuccess("Course created successfully!");
      }

      // Redirect to courses page after a delay to show success message
      setTimeout(() => {
        navigate("/courses");
      }, 1500);
    } catch (error) {
      console.error("Error saving course:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to save course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isEditing ? "Edit Course" : "Create New Course"}
        </h2>

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
            <div>
              <label htmlFor="code" className="input-label">
                Course Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. CS101"
                disabled={loading || isEditing} // Disable editing code for existing courses
                required
              />
            </div>

            <div>
              <label htmlFor="term" className="input-label">
                Term
              </label>
              <select
                id="term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
                required
              >
                <option value="Spring 2025">Spring 2025</option>
                <option value="Summer 2025">Summer 2025</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Winter 2025">Winter 2025</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="name" className="input-label">
                Course Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Introduction to Computer Science"
                disabled={loading}
                required
              />
            </div>

            {/* Professor selection dropdown */}
            <div className="md:col-span-2">
              <label htmlFor="professor_id" className="input-label">
                Assign Professor
              </label>
              <select
                id="professor_id"
                name="professor_id"
                value={formData.professor_id}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
                required={!isEditing} // Only required for new courses
              >
                <option value="">-- Select a Professor --</option>
                {availableProfessors.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.first_name} {professor.last_name} (
                    {professor.email})
                  </option>
                ))}
              </select>
              {availableProfessors.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No professors available. Please create a professor account
                  first.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="input-label">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                placeholder="Enter course description"
                disabled={loading}
              />
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

            <GradientButton
              type="submit"
              disabled={
                loading || (availableProfessors.length === 0 && !isEditing)
              }
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Course"
                : "Create Course"}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
