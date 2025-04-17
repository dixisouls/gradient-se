import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import CourseForm from "../components/courses/CourseForm";
import Card from "../components/common/Card";
import GradientButton from "../components/common/GradientButton";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import courseService from "../services/courseService";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const isProfessor = currentUser?.role === "professor";

  useEffect(() => {
    // Check if the ID is "new" - in which case we shouldn't fetch anything
    if (id === "new") {
      // Instead of trying to fetch a course with ID "new", redirect back to courses page
      navigate("/courses", { state: { showCreateForm: true } });
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await courseService.getCourseById(id);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  // Rest of the component remains the same...
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
            <Button onClick={() => navigate("/courses")}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4">
          <Alert type="error" message="Course not found" />
          <div className="mt-6">
            <Button onClick={() => navigate("/courses")}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showEditForm && isProfessor) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
            Edit Course
          </h2>
          <CourseForm courseId={id} onCancel={() => setShowEditForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4">
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/courses")}
            >
              Back to Courses
            </Button>
          </div>

          {isProfessor && (
            <Button onClick={() => setShowEditForm(true)}>Edit Course</Button>
          )}
        </div>

        <Card gradientBorder className="mb-6 md:mb-8">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-0 break-words">
                {course.name}
              </h1>
              <span className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-full self-start">
                {course.term}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{course.code}</p>
          </div>

          {course.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-700">{course.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium text-gray-800 text-sm md:text-base">
                {new Date(course.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-800 text-sm md:text-base">
                {new Date(course.updated_at).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
              <p className="text-sm text-gray-500">Students</p>
              <p className="font-medium text-gray-800 text-sm md:text-base">
                42
              </p>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
              <p className="text-sm text-gray-500">Assignments</p>
              <p className="font-medium text-gray-800 text-sm md:text-base">
                5
              </p>
            </div>
          </div>
        </Card>

        {/* Assignments Section and rest of component remains the same */}
      </div>
    </div>
  );
};

export default CourseDetailPage;
