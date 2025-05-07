import React, { useState } from "react";
import Card from "../common/Card";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import Button from "../common/Button";
import courseService from "../../services/courseService";

const CourseRegistrationForm = ({
  availableCourses,
  userCourses,
  onRegistrationSuccess,
  setError,
}) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Calculate how many more courses a student can select
  const MAX_COURSES = 3;
  const remainingSlots = MAX_COURSES - userCourses.length;

  // Toggle course selection
  const toggleCourseSelection = (course) => {
    if (selectedCourses.some((selected) => selected.id === course.id)) {
      // If course is already selected, remove it
      setSelectedCourses(
        selectedCourses.filter((selected) => selected.id !== course.id)
      );
    } else {
      // If course is not selected, check if we can add more courses
      if (selectedCourses.length < remainingSlots) {
        setSelectedCourses([...selectedCourses, course]);
      } else {
        setLocalError(
          `You can select a maximum of ${remainingSlots} more course${
            remainingSlots !== 1 ? "s" : ""
          }.`
        );
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
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
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
        {userCourses.length >= MAX_COURSES ? (
          <Alert
            type="info"
            message={`You are already enrolled in the maximum number of courses (${MAX_COURSES}). To register for new courses, you must first drop some of your current courses.`}
            className="mb-4"
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">
                Select up to {remainingSlots} course
                {remainingSlots !== 1 ? "s" : ""} to register for this term:
              </p>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                {userCourses.length}/{MAX_COURSES} courses enrolled
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  className={`border rounded-lg p-3 md:p-4 cursor-pointer transition-all ${
                    selectedCourses.some(
                      (selected) => selected.id === course.id
                    )
                      ? "border-gradient-primary bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10"
                      : "border-gray-200 hover:border-gradient-primary"
                  }`}
                  onClick={() => toggleCourseSelection(course)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="mb-2 sm:mb-0 sm:mr-2">
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base break-words">
                        {course.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">
                        {course.code}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded-full self-start whitespace-nowrap">
                      {course.term}
                    </span>
                  </div>
                  {course.description && (
                    <p className="text-xs md:text-sm text-gray-600 mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0 w-full sm:w-auto">
          <span className="text-sm text-gray-600">
            Selected: {selectedCourses.length}/{remainingSlots} available slots
          </span>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setSelectedCourses([])}
            disabled={
              selectedCourses.length === 0 ||
              loading ||
              success ||
              userCourses.length >= MAX_COURSES
            }
            fullWidth
            className="sm:w-auto"
          >
            Clear Selection
          </Button>
          <GradientButton
            onClick={handleSubmit}
            disabled={
              selectedCourses.length === 0 ||
              loading ||
              success ||
              userCourses.length >= MAX_COURSES
            }
            fullWidth
            className="sm:w-auto"
          >
            {loading
              ? "Registering..."
              : `Add ${selectedCourses.length} Selected Course${
                  selectedCourses.length !== 1 ? "s" : ""
                }`}
          </GradientButton>
        </div>
      </div>
    </Card>
  );
};

export default CourseRegistrationForm;
