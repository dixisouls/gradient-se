import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import assignmentService from "../../services/assignmentService";
import submissionService from "../../services/submissionService";
import Card from "../common/Card";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import Button from "../common/Button";

const ProfessorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState({
    courses: true,
    submissions: true,
    assignments: true,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch professor courses
  useEffect(() => {
    const fetchProfessorCourses = async () => {
      try {
        const userCourses = await courseService.getUserCourses();
        setCourses(userCourses);
      } catch (error) {
        console.error("Error fetching professor courses:", error);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, courses: false }));
      }
    };

    fetchProfessorCourses();
  }, []);

  // Fetch pending submissions (needs review)
  useEffect(() => {
    const fetchPendingSubmissions = async () => {
      try {
        // Get all submissions (will be filtered based on professor's courses)
        const data = await submissionService.getSubmissions();

        // Filter for submissions with AI grading that need professor review
        const pendingReview = data.submissions
          .filter(
            (sub) =>
              sub.status === "graded" &&
              (!sub.feedback || !sub.feedback.professor_review)
          )
          .sort(
            (a, b) => new Date(b.submission_time) - new Date(a.submission_time)
          )
          .slice(0, 5); // Get latest 5

        setPendingSubmissions(pendingReview);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        // Don't show error, just empty state
      } finally {
        setLoading((prev) => ({ ...prev, submissions: false }));
      }
    };

    fetchPendingSubmissions();
  }, []);

  // Fetch recent assignments
  useEffect(() => {
    const fetchRecentAssignments = async () => {
      try {
        const data = await assignmentService.getAllAssignments();

        // Sort by creation date, newest first
        const recent = data.assignments
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3); // Get latest 3

        setRecentAssignments(recent);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        // Don't show error, just empty state
      } finally {
        setLoading((prev) => ({ ...prev, assignments: false }));
      }
    };

    fetchRecentAssignments();
  }, []);

  const createNewCourse = () => {
    navigate("/courses/new");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Professor Dashboard
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
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
      <section className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            My Courses
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={createNewCourse}
              className="flex-grow sm:flex-grow-0"
            >
              Create Course
            </Button>
            <Link to="/courses" className="flex-grow sm:flex-grow-0">
              <GradientButton size="sm" className="w-full">
                Browse All Courses
              </GradientButton>
            </Link>
          </div>
        </div>

        {loading.courses ? (
          <div className="flex justify-center py-10">
            <Loading size="lg" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-8 sm:py-10">
            <p className="text-gray-600 mb-4">
              You haven't created any courses yet.
            </p>
            <GradientButton onClick={createNewCourse}>
              Create Your First Course
            </GradientButton>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block hover:no-underline"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="mb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <h4 className="font-semibold text-gray-800 mr-3 mb-1 sm:mb-0 break-words">
                        {course.name}
                      </h4>
                      <span className="inline-flex px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-full whitespace-nowrap self-start">
                        {course.term}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>

                  {course.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pending Grading Section */}
      <section className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Pending Review
          </h3>
          <Link to="/grading">
            <Button size="sm">View All Grading Tasks</Button>
          </Link>
        </div>

        {loading.submissions ? (
          <div className="flex justify-center py-6">
            <Loading />
          </div>
        ) : pendingSubmissions.length === 0 ? (
          <Card className="text-center py-6 sm:py-8">
            <p className="text-gray-600">
              No submissions requiring your review at this time.
            </p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Submitted
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      AI Score
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-800 truncate max-w-[150px] sm:max-w-none">
                          {submission.assignment_title ||
                            "Assignment Submission"}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-gray-600 truncate max-w-[100px] sm:max-w-none">
                          {submission.student_name || "Student"}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                        <div className="text-gray-600">
                          {new Date(
                            submission.submission_time
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                        <div className="text-gray-600">
                          {submission.feedback?.score !== undefined
                            ? submission.feedback.score
                            : "Pending"}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link to={`/submissions/${submission.id}`}>
                          <Button size="sm">Review</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      {/* Recent Assignments Section */}
      <section className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Recent Assignments
          </h3>
          <Link to="/assignments">
            <Button size="sm">Manage All Assignments</Button>
          </Link>
        </div>

        {loading.assignments ? (
          <div className="flex justify-center py-6">
            <Loading />
          </div>
        ) : recentAssignments.length === 0 ? (
          <Card className="text-center py-6 sm:py-8">
            <p className="text-gray-600 mb-4">
              You haven't created any assignments yet.
            </p>
            <Link to="/assignments">
              <GradientButton>Create Assignment</GradientButton>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {recentAssignments.map((assignment) => (
              <Link
                key={assignment.id}
                to={`/assignments/${assignment.id}`}
                className="block hover:no-underline"
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <div>
                    <h3 className="font-semibold text-gray-800 break-words">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                    <div className="flex mt-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                        {assignment.assignment_type}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Links Section */}
      <section>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Link to="/assignments" className="block hover:no-underline">
            <Card className="text-center py-4 sm:py-6 hover:shadow-md transition-shadow h-full">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 sm:h-10 sm:w-10 text-gradient-primary mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="font-medium">Create Assignment</p>
              </div>
            </Card>
          </Link>

          <Link to="/grading" className="block hover:no-underline">
            <Card className="text-center py-4 sm:py-6 hover:shadow-md transition-shadow h-full">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 sm:h-10 sm:w-10 text-gradient-secondary mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <p className="font-medium">Grade Submissions</p>
              </div>
            </Card>
          </Link>

          <Link to="/courses/new" className="block hover:no-underline">
            <Card className="text-center py-4 sm:py-6 hover:shadow-md transition-shadow h-full">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 sm:h-10 sm:w-10 text-gradient-tertiary mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="font-medium">Create Course</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProfessorDashboard;
