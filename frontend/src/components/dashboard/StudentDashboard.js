import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseService from "../../services/courseService";
import Card from "../common/Card";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        const userCourses = await courseService.getUserCourses();
        setCourses(userCourses);
      } catch (error) {
        console.error("Error fetching user courses:", error);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Student Dashboard
        </h2>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your courses and recent
          activities.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* My Courses Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">My Courses</h3>
          <Link to="/courses">
            <GradientButton size="sm">Browse All Courses</GradientButton>
          </Link>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-600 mb-4">
              You are not enrolled in any courses yet.
            </p>
            <Link to="/courses">
              <GradientButton>Browse Available Courses</GradientButton>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block hover:no-underline"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="mb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800 mr-3">
                        {course.name}
                      </h4>
                      <span className="inline-flex px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-full whitespace-nowrap">
                        {course.term}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>

                  {/* Sample data for display purposes */}
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Upcoming assignments:
                      </span>
                      <span className="font-medium text-gradient-primary">
                        2
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Recent feedback:</span>
                      <span className="font-medium text-gradient-primary">
                        3
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Recent Activity
        </h3>

        <Card>
          <div className="space-y-4">
            {/* Sample activity items - would be populated from actual backend data */}
            <div className="border-l-4 border-gradient-primary pl-4 py-2">
              <p className="font-medium text-gray-800">
                New feedback available
              </p>
              <p className="text-gray-600">
                Your submission for "Essay Assignment 1" has been graded.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                CS101: Introduction to Computer Science · 2 hours ago
              </p>
            </div>

            <div className="border-l-4 border-gradient-secondary pl-4 py-2">
              <p className="font-medium text-gray-800">
                Assignment deadline approaching
              </p>
              <p className="text-gray-600">
                Programming Exercise 3 is due in 2 days.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                CS401: Advanced Algorithms · 5 hours ago
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-4 py-2">
              <p className="font-medium text-gray-800">
                Course materials updated
              </p>
              <p className="text-gray-600">
                New lecture slides have been added to MATH401.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                MATH401: Advanced Calculus · 1 day ago
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Progress Overview */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Progress Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center py-6">
            <p className="text-gray-600 mb-2">Assignments Completed</p>
            <div className="text-3xl font-bold text-gradient-primary">
              12/15
            </div>
          </Card>

          <Card className="text-center py-6">
            <p className="text-gray-600 mb-2">Average Grade</p>
            <div className="text-3xl font-bold text-gradient-secondary">B+</div>
          </Card>

          <Card className="text-center py-6">
            <p className="text-gray-600 mb-2">Feedback Received</p>
            <div className="text-3xl font-bold text-gradient-tertiary">24</div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
