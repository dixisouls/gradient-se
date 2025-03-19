import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import Card from "../common/Card";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import Button from "../common/Button";

const ProfessorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessorCourses = async () => {
      try {
        setLoading(true);
        const userCourses = await courseService.getUserCourses();
        setCourses(userCourses);
      } catch (error) {
        console.error("Error fetching professor courses:", error);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorCourses();
  }, []);

  const createNewCourse = () => {
    navigate("/courses/new");
  };

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
          Professor Dashboard
        </h2>
        <p className="text-gray-600">
          Welcome back! Manage your courses and student assignments.
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
          <div className="flex space-x-4">
            <Button size="sm" onClick={createNewCourse}>
              Create Course
            </Button>
            <Link to="/courses">
              <GradientButton size="sm">Browse All Courses</GradientButton>
            </Link>
          </div>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-600 mb-4">
              You haven't created any courses yet.
            </p>
            <GradientButton onClick={createNewCourse}>
              Create Your First Course
            </GradientButton>
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
                      <span className="text-gray-600">Total students:</span>
                      <span className="font-medium text-gradient-primary">
                        42
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Pending grading:</span>
                      <span className="font-medium text-gradient-primary">
                        7
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Assignments:</span>
                      <span className="font-medium text-gradient-primary">
                        5
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pending Grading Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Pending Grading
        </h3>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample pending assignments */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">
                      Essay Assignment 2
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">
                      ENG301: Technical Writing
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">John Smith</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">2 hours ago</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                      AI Graded
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gradient-primary hover:text-gradient-secondary">
                      Review
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">
                      Midterm Project
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">
                      CS401: Advanced Algorithms
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">Emily Johnson</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">1 day ago</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      Needs Review
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gradient-primary hover:text-gradient-secondary">
                      Grade
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">
                      Data Analysis Report
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">
                      PSYCH201: Cognitive Psychology
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">Michael Brown</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">3 days ago</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                      AI Graded
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gradient-primary hover:text-gradient-secondary">
                      Review
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-center">
            <button className="text-gradient-primary hover:text-gradient-secondary font-medium">
              View All Pending Submissions
            </button>
          </div>
        </Card>
      </section>

      {/* Analytics Overview */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Analytics Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center py-6">
            <p className="text-gray-600 mb-2">Total Students</p>
            <div className="text-3xl font-bold text-gradient-primary">128</div>
          </Card>

          <Card className="text-center py-6">
            <p className="text-gray-600 mb-2">Assignments Created</p>
            <div className="text-3xl font-bold text-gradient-secondary">32</div>
          </Card>

          <Card className="text-center py-6">
            <p className="text-gray-600 mb-2">Avg. Feedback Time</p>
            <div className="text-3xl font-bold text-gradient-tertiary">
              2.4h
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ProfessorDashboard;
