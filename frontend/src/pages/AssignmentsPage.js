import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import GradientButton from "../components/common/GradientButton";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";
import AssignmentForm from "../components/assignments/AssignmentForm";
import assignmentService from "../services/assignmentService";
import courseService from "../services/courseService";

const AssignmentsPage = () => {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if course_id is in query params (e.g., /assignments?course_id=1)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("course_id");
    if (courseId) {
      setSelectedCourse(parseInt(courseId));
    }
  }, [location]);

  const isProfessor = currentUser?.role === "professor";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getAllAssignments();
        setAssignments(data.assignments || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setError("Failed to load assignments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Fetch courses for professor to select when creating assignment
  useEffect(() => {
    if (isProfessor) {
      const fetchCourses = async () => {
        try {
          const data = await courseService.getUserCourses();
          setCourses(data || []);

          // If no course is selected yet and we have courses, select the first one
          if (!selectedCourse && data && data.length > 0) {
            setSelectedCourse(data[0].id);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };

      fetchCourses();
    }
  }, [isProfessor, selectedCourse]);

  const handleViewAssignment = (assignmentId) => {
    navigate(`/assignments/${assignmentId}`);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(parseInt(e.target.value));
  };

  const getAssignmentTypeBadge = (type) => {
    const typeClasses = {
      code: "bg-purple-100 text-purple-800",
      essay: "bg-blue-100 text-blue-800",
      presentation: "bg-green-100 text-green-800",
      quiz: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          typeClasses[type] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getDueDateStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);

    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Overdue",
        class: "text-red-600",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due Today",
        class: "text-yellow-600",
      };
    } else if (diffDays <= 3) {
      return {
        text: `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
        class: "text-yellow-600",
      };
    } else {
      return {
        text: `Due in ${diffDays} days`,
        class: "text-green-600",
      };
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          {isProfessor && (
            <div className="flex items-center space-x-4">
              {courses.length > 0 && !showCreateForm && (
                <select
                  value={selectedCourse || ""}
                  onChange={handleCourseChange}
                  className="input-field py-2"
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code}: {course.name}
                    </option>
                  ))}
                </select>
              )}
              <GradientButton
                onClick={() => setShowCreateForm(true)}
                disabled={!selectedCourse && courses.length > 0}
              >
                Create Assignment
              </GradientButton>
            </div>
          )}
        </div>

        {showCreateForm ? (
          <div>
            <Card title="Create New Assignment">
              <AssignmentForm
                courseId={selectedCourse}
                onCancel={() => setShowCreateForm(false)}
              />
            </Card>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loading size="lg" />
              </div>
            ) : error ? (
              <Alert type="error" message={error} />
            ) : assignments.length === 0 ? (
              <Card className="text-center py-10">
                <p className="text-gray-600 mb-4">
                  {isProfessor
                    ? "You haven't created any assignments yet."
                    : "No assignments available."}
                </p>
                {isProfessor && selectedCourse && (
                  <GradientButton onClick={() => setShowCreateForm(true)}>
                    Create Your First Assignment
                  </GradientButton>
                )}
                {isProfessor && !selectedCourse && courses.length > 0 && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Please select a course to create an assignment.
                    </p>
                    <select
                      value={selectedCourse || ""}
                      onChange={handleCourseChange}
                      className="input-field py-2 max-w-xs mx-auto"
                    >
                      <option value="" disabled>
                        Select Course
                      </option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.code}: {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {assignment.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {assignment.course_code}: {assignment.course_name}
                        </p>
                      </div>
                      <div>
                        {getAssignmentTypeBadge(assignment.assignment_type)}
                      </div>
                    </div>

                    {assignment.description && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {assignment.description}
                      </p>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <span
                        className={getDueDateStatus(assignment.due_date).class}
                      >
                        {getDueDateStatus(assignment.due_date).text}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleViewAssignment(assignment.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
