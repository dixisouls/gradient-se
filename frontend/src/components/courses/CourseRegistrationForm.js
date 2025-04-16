import React, { useState } from "react";
import Card from "../common/Card";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import Button from "../common/Button";
import courseService from "../../services/courseService";

const CourseRegistrationForm = ({
  availableCourses,
  onRegistrationSuccess,
  setError,
}) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Toggle course selection
  const toggleCourseSelection = (course) => {
    if (selectedCourses.some((selected) => selected.id === course.id)) {
      // If course is already selected, remove it
      setSelectedCourses(
        selectedCourses.filter((selected) => selected.id !== course.id)
      );
    } else {
      // If course is not selected, add it (up to max 3)
      if (selectedCourses.length < 3) {
        setSelectedCourses([...selectedCourses, course]);
      } else {
        setLocalError("You can select a maximum of 3 courses at a time.");
        setTimeout(() => {
          setLocalError(null);
        }, 3000);
      }
    }
  };

  // Handle registration submission
  const handleSubmit = async () => {
    // Validate selection
    if (selectedCourses.length === 0) {
      setLocalError("Please select at least one course to register.");
      return;
    }

    try {
      setLoading(true);
      setLocalError(null);
      setError(null);

      // Extract course IDs for API request
      const courseIds = selectedCourses.map((course) => course.id);

      // Submit course registration
      const registeredCourses = await courseService.selectCourses(courseIds);

      // Show success message
      setSuccess(true);

      // Call the parent callback with registered courses
      onRegistrationSuccess(registeredCourses);
    } catch (error) {
      console.error("Error registering for courses:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to register for courses. Please try again.";
      setLocalError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Register for Courses
      </h2>

      {localError && (
        <Alert
          type="error"
          message={localError}
          onClose={() => setLocalError(null)}
          className="mb-4"
        />
      )}

      {success && (
        <Alert
          type="success"
          message="Successfully registered for selected courses! Redirecting to dashboard..."
          className="mb-4"
        />
      )}

      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Select up to 3 courses to register for this term:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCourses.map((course) => (
            <div
              key={course.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedCourses.some((selected) => selected.id === course.id)
                  ? "border-gradient-primary bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10"
                  : "border-gray-200 hover:border-gradient-primary"
              }`}
              onClick={() => toggleCourseSelection(course)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                  {course.term}
                </span>
              </div>
              {course.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600">
            Selected: {selectedCourses.length}/3 courses
          </span>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedCourses([])}
            disabled={selectedCourses.length === 0 || loading}
          >
            Clear Selection
          </Button>
          <GradientButton
            onClick={handleSubmit}
            disabled={selectedCourses.length === 0 || loading || success}
          >
            {loading ? "Registering..." : "Register for Selected Courses"}
          </GradientButton>
        </div>
      </div>
    </Card>
  );
};

export default CourseRegistrationForm;
