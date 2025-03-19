import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import GradientButton from "../components/common/GradientButton";
import Alert from "../components/common/Alert";

const AssignmentsPage = () => {
  const { currentUser } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Sample assignment data based on the database schema
  const assignments = [
    {
      id: 1,
      title: "Python Basics",
      description: "Write a program that calculates the factorial of a number.",
      courseId: 1,
      courseName: "Introduction to Computer Science",
      courseCode: "CS101",
      assignmentType: "code",
      dueDate: "2025-03-26T23:59:59Z",
      pointsPossible: 50,
      allowResubmissions: true,
      resubmissionDeadline: "2025-03-29T23:59:59Z",
      submissions: 28,
      pendingGrading: 5,
    },
    {
      id: 2,
      title: "Algorithm Analysis",
      description: "Analyze the time complexity of common sorting algorithms.",
      courseId: 1,
      courseName: "Introduction to Computer Science",
      courseCode: "CS101",
      assignmentType: "essay",
      dueDate: "2025-04-02T23:59:59Z",
      pointsPossible: 50,
      allowResubmissions: false,
      resubmissionDeadline: null,
      submissions: 12,
      pendingGrading: 12,
    },
    {
      id: 3,
      title: "Research Paper",
      description: "Write a 10-page research paper on a topic of your choice.",
      courseId: 2,
      courseName: "Advanced Composition",
      courseCode: "ENG201",
      assignmentType: "essay",
      dueDate: "2025-04-09T23:59:59Z",
      pointsPossible: 100,
      allowResubmissions: true,
      resubmissionDeadline: "2025-04-16T23:59:59Z",
      submissions: 15,
      pendingGrading: 3,
    },
    {
      id: 4,
      title: "Literary Analysis Presentation",
      description: "Create a presentation analyzing a work of literature.",
      courseId: 2,
      courseName: "Advanced Composition",
      courseCode: "ENG201",
      assignmentType: "presentation",
      dueDate: "2025-03-29T23:59:59Z",
      pointsPossible: 75,
      allowResubmissions: false,
      resubmissionDeadline: null,
      submissions: 8,
      pendingGrading: 8,
    },
    {
      id: 5,
      title: "Matrix Operations",
      description:
        "Solve problems involving matrix operations and transformations.",
      courseId: 3,
      courseName: "Linear Algebra",
      courseCode: "MATH303",
      assignmentType: "quiz",
      dueDate: "2025-03-24T23:59:59Z",
      pointsPossible: 30,
      allowResubmissions: false,
      resubmissionDeadline: null,
      submissions: 32,
      pendingGrading: 15,
    },
  ];

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowCreateForm(false);
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
          <GradientButton
            onClick={() => {
              setSelectedAssignment(null);
              setShowCreateForm(true);
            }}
          >
            Create Assignment
          </GradientButton>
        </div>

        {showCreateForm ? (
          <Card title="Create New Assignment">
            <div className="bg-gray-50 p-6 rounded-md text-center">
              <p className="text-gray-600 mb-4">
                Assignment creation form will be implemented soon.
              </p>
              <Button onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </Card>
        ) : selectedAssignment ? (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAssignment(null)}
              className="mb-6"
            >
              Back to All Assignments
            </Button>

            <Card gradientBorder className="mb-8">
              <div className="mb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedAssignment.title}
                    </h2>
                    <p className="text-gray-600">
                      {selectedAssignment.courseCode}:{" "}
                      {selectedAssignment.courseName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getAssignmentTypeBadge(selectedAssignment.assignmentType)}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full bg-gray-100 ${
                        getDueDateStatus(selectedAssignment.dueDate).class
                      }`}
                    >
                      {getDueDateStatus(selectedAssignment.dueDate).text}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAssignment.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700">
                    {selectedAssignment.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Points Possible</p>
                  <p className="font-medium text-gray-800">
                    {selectedAssignment.pointsPossible}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedAssignment.dueDate).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Resubmissions</p>
                  <p className="font-medium text-gray-800">
                    {selectedAssignment.allowResubmissions ? (
                      <>
                        Allowed until{" "}
                        {new Date(
                          selectedAssignment.resubmissionDeadline
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      "Not allowed"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Total Submissions</p>
                  <p className="font-medium text-gray-800">
                    {selectedAssignment.submissions}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Pending Grading</p>
                  <p className="font-medium text-gray-800">
                    {selectedAssignment.pendingGrading}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <GradientButton>View Submissions</GradientButton>
              <Button variant="outline">Edit Assignment</Button>
            </div>
          </div>
        ) : (
          <div>
            {assignments.length === 0 ? (
              <Card className="text-center py-10">
                <p className="text-gray-600 mb-4">
                  You haven't created any assignments yet.
                </p>
                <GradientButton onClick={() => setShowCreateForm(true)}>
                  Create Your First Assignment
                </GradientButton>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">
                            {assignment.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {assignment.courseCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAssignmentTypeBadge(assignment.assignmentType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={
                              getDueDateStatus(assignment.dueDate).class
                            }
                          >
                            {getDueDateStatus(assignment.dueDate).text}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {assignment.pendingGrading} /{" "}
                            {assignment.submissions}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            size="sm"
                            onClick={() => handleViewAssignment(assignment)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
