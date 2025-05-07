import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import GradientButton from "../components/common/GradientButton";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";
import CourseRegistrationForm from "../components/courses/CourseRegistrationForm";
import courseService from "../services/courseService";

const CourseRegistrationPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const navigate = useNavigate();

  // Define maximum courses constant
  const MAX_COURSES = 3;

  // Redirect if user is not a student
  useEffect(() => {
    if (currentUser && currentUser.role !== "student") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Fetch all courses and user courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all available courses
        const allCoursesData = await courseService.getAllCourses();
        setAllCourses(allCoursesData.courses || []);

        // Fetch user's current courses
        const userCoursesData = await courseService.getUserCourses();
        setUserCourses(userCoursesData || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses to show only those the user is not enrolled in
  const availableCourses = allCourses.filter(
    (course) => !userCourses.some((userCourse) => userCourse.id === course.id)
  );

  // Calculate remaining slots
  const remainingSlots = MAX_COURSES - userCourses.length;

  // Handle successful registration
  const handleRegistrationSuccess = (courses) => {
    // Update the user courses
    setUserCourses(courses);
    // Show success message
    setError(null);
    // Redirect to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:p-8 pt-16 md:pt-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
          Course Registration
        </h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : (
          <div>
            {/* Current Courses Section */}
            <section className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Your Current Courses
              </h2>

              {userCourses.length === 0 ? (
                <Card className="text-center py-6">
                  <p className="text-gray-600">
                    You are not enrolled in any courses yet.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userCourses.map((course) => (
                    <Card key={course.id} className="bg-blue-50">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-800 break-words">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-500">{course.code}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                          {course.term}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          View Course
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Course Registration Form */}
            {availableCourses.length > 0 && remainingSlots > 0 ? (
              <CourseRegistrationForm
                availableCourses={availableCourses}
                userCourses={userCourses}
                onRegistrationSuccess={handleRegistrationSuccess}
                setError={setError}
              />
            ) : (
              <Card className="text-center py-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  {userCourses.length >= MAX_COURSES
                    ? "Maximum Courses Reached"
                    : "No Available Courses"}
                </h2>
                <p className="text-gray-600 mb-4">
                  {userCourses.length >= MAX_COURSES
                    ? "You are already enrolled in the maximum number of courses (3). To register for new courses, you must first drop some of your current courses."
                    : "There are no additional courses available for registration at this time."}
                </p>
                <GradientButton onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </GradientButton>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRegistrationPage;
