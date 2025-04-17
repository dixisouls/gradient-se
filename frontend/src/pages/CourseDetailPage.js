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
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 flex justify-center items-center pt-16 md:pt-4 md:ml-64">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4 md:ml-64">
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
        <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4 md:ml-64">
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
        <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4 md:ml-64">
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

      <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4 md:ml-64">
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

        {/* Assignments Section */}
        <section className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Assignments
            </h2>

            {isProfessor && <Button size="sm">Add Assignment</Button>}
          </div>

          {/* Sample assignments - would be populated from actual backend data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Essay Assignment 1
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Due: March 25, 2025
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Open
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Write a 1000-word essay analyzing the main themes in the
                assigned readings.
              </p>
              <div className="mt-4">
                <GradientButton size="sm">View Details</GradientButton>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Research Project
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Due: April 15, 2025
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                  Upcoming
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Prepare a research proposal on a topic of your choice related to
                the course.
              </p>
              <div className="mt-4">
                <GradientButton size="sm">View Details</GradientButton>
              </div>
            </Card>
          </div>

          <div className="text-center mt-4">
            <button className="text-gradient-primary hover:text-gradient-secondary font-medium">
              View All Assignments
            </button>
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Resources
            </h2>

            {isProfessor && <Button size="sm">Add Resource</Button>}
          </div>

          {/* Sample resources - would be populated from actual backend data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-gradient-primary mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800">Syllabus</h3>
                  <p className="text-gray-600 text-sm">PDF, 243 KB</p>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-gradient-secondary mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800">Lecture 1</h3>
                  <p className="text-gray-600 text-sm">Video, 45:22</p>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-gradient-tertiary mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Required Readings
                  </h3>
                  <p className="text-gray-600 text-sm">PDF, 1.2 MB</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseDetailPage;
