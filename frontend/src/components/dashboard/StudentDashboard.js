import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseService from "../../services/courseService";
import submissionService from "../../services/submissionService";
import assignmentService from "../../services/assignmentService";
import Card from "../common/Card";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import Button from "../common/Button";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [loading, setLoading] = useState({
    courses: true,
    submissions: true,
    assignments: true,
  });
  const [error, setError] = useState(null);

  // Fetch user courses
  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const userCourses = await courseService.getUserCourses();
        setCourses(userCourses);
      } catch (error) {
        console.error("Error fetching user courses:", error);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, courses: false }));
      }
    };

    fetchUserCourses();
  }, []);

  // Fetch recent submissions
  useEffect(() => {
    const fetchRecentSubmissions = async () => {
      try {
        const data = await submissionService.getSubmissions();
        // Sort by newest first
        const sortedSubmissions = data.submissions.sort(
          (a, b) => new Date(b.submission_time) - new Date(a.submission_time)
        );
        setSubmissions(sortedSubmissions.slice(0, 5)); // Get latest 5
      } catch (error) {
        console.error("Error fetching submissions:", error);
        // Don't set error for submissions - just show empty
      } finally {
        setLoading((prev) => ({ ...prev, submissions: false }));
      }
    };

    fetchRecentSubmissions();
  }, []);

  // Fetch upcoming assignments
  useEffect(() => {
    const fetchUpcomingAssignments = async () => {
      try {
        const data = await assignmentService.getAllAssignments();

        // Filter for upcoming assignments (due date in the future)
        const now = new Date();
        const upcoming = data.assignments
          .filter((assignment) => new Date(assignment.due_date) > now)
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
          .slice(0, 3); // Get closest 3

        setUpcomingAssignments(upcoming);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        // Don't set error for assignments - just show empty
      } finally {
        setLoading((prev) => ({ ...prev, assignments: false }));
      }
    };

    fetchUpcomingAssignments();
  }, []);

  // Format date relative to now
  const formatRelativeDate = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffTime = Math.abs(date - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ${
        date > now ? "from now" : "ago"
      }`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ${
        date > now ? "from now" : "ago"
      }`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ${
        date > now ? "from now" : "ago"
      }`;
    }
  };

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
          <div className="flex space-x-4">
            {/* New Course Registration Button */}
            <Link to="/course-registration">
              <Button>Register for Courses</Button>
            </Link>
            <Link to="/courses">
              <GradientButton size="sm">Browse All Courses</GradientButton>
            </Link>
          </div>
        </div>

        {loading.courses ? (
          <div className="flex justify-center py-10">
            <Loading size="lg" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-600 mb-4">
              You are not enrolled in any courses yet.
            </p>
            <Link to="/course-registration">
              <GradientButton>Register for Courses</GradientButton>
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

                  {course.description && (
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Rest of the component remains unchanged */}
      {/* Upcoming Assignments Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Upcoming Assignments
        </h3>

        {loading.assignments ? (
          <div className="flex justify-center py-6">
            <Loading />
          </div>
        ) : upcomingAssignments.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-600">No upcoming assignments due soon.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingAssignments.map((assignment) => (
              <Link
                key={assignment.id}
                to={`/assignments/${assignment.id}`}
                className="block hover:no-underline"
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Due:{" "}
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {formatRelativeDate(assignment.due_date)}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Submissions Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Recent Submissions
        </h3>

        {loading.submissions ? (
          <div className="flex justify-center py-6">
            <Loading />
          </div>
        ) : submissions.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-600">
              You haven't submitted any assignments yet.
            </p>
            <Link to="/assignments" className="mt-4 inline-block">
              <GradientButton>View Assignments</GradientButton>
            </Link>
          </Card>
        ) : (
          <Card>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Link
                  key={submission.id}
                  to={`/submissions/${submission.id}`}
                  className="block hover:no-underline"
                >
                  <div className="border-l-4 border-gradient-primary pl-4 py-2 hover:bg-gray-50 rounded-r">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">
                        {submission.assignment_title || "Assignment Submission"}
                      </p>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          submission.status === "graded"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {submission.status === "graded" ? "Graded" : "Pending"}
                      </span>
                    </div>
                    {submission.status === "graded" && submission.feedback ? (
                      <p className="text-gray-600 mt-1">
                        Score:{" "}
                        <span className="font-medium">
                          {submission.feedback.score}
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-600 mt-1">
                        Submitted{" "}
                        {formatRelativeDate(submission.submission_time)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* Quick Links */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Quick Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/assignments" className="block hover:no-underline">
            <Card className="text-center py-6 hover:shadow-md transition-shadow h-full">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gradient-primary mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="font-medium">View All Assignments</p>
              </div>
            </Card>
          </Link>

          <Link to="/submissions" className="block hover:no-underline">
            <Card className="text-center py-6 hover:shadow-md transition-shadow h-full">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gradient-secondary mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="font-medium">My Submissions</p>
              </div>
            </Card>
          </Link>

          <Link to="/course-registration" className="block hover:no-underline">
            <Card className="text-center py-6 hover:shadow-md transition-shadow h-full">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gradient-tertiary mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
                <p className="font-medium">Register for Courses</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
