import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import GradientButton from "../components/common/GradientButton";

const SubmissionsPage = () => {
  const { currentUser } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Sample submission data based on the database schema
  const submissions = [
    {
      id: 1,
      assignmentId: 1,
      assignmentTitle: "Python Basics",
      courseName: "Introduction to Computer Science",
      courseCode: "CS101",
      submissionTime: "2025-03-17T15:30:00Z",
      status: "submitted",
      feedback: {
        id: 1,
        feedbackText:
          "Good implementation of the recursive factorial function. The code is concise and correct.",
        grammarScore: null,
        readabilityScore: null,
        structureScore: null,
        logicScore: 95.0,
        similarityScore: 90.0,
        suggestedGrade: 45.0,
        finalGrade: 45.0,
        gradedBy: "GRADiEnt AI",
        professorReview: true,
        professorComments: "Nice work on implementing the recursive solution!",
      },
    },
    {
      id: 2,
      assignmentId: 3,
      assignmentTitle: "Research Paper",
      courseName: "Advanced Composition",
      courseCode: "ENG201",
      submissionTime: "2025-03-14T12:45:00Z",
      status: "graded",
      feedback: {
        id: 3,
        feedbackText:
          "The research paper has a strong thesis and good supporting evidence. Some improvements needed in the conclusion.",
        grammarScore: 88.5,
        readabilityScore: 85.0,
        structureScore: 82.0,
        logicScore: null,
        similarityScore: 78.0,
        suggestedGrade: 76.0,
        finalGrade: 78.0,
        gradedBy: "GRADiEnt AI",
        professorReview: true,
        professorComments:
          "Good work, but please strengthen your conclusion in your next draft.",
      },
    },
    {
      id: 3,
      assignmentId: 5,
      assignmentTitle: "Matrix Operations",
      courseName: "Linear Algebra",
      courseCode: "MATH303",
      submissionTime: "2025-03-18T09:15:00Z",
      status: "submitted",
      feedback: null,
    },
  ];

  const getStatusBadge = (status) => {
    const statusClasses = {
      submitted: "bg-blue-100 text-blue-800",
      graded: "bg-green-100 text-green-800",
      resubmitted: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Submissions
        </h1>

        {selectedSubmission ? (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSubmission(null)}
              className="mb-6"
            >
              Back to All Submissions
            </Button>

            <Card gradientBorder className="mb-8">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedSubmission.assignmentTitle}
                    </h2>
                    <p className="text-gray-600">
                      {selectedSubmission.courseCode}:{" "}
                      {selectedSubmission.courseName}
                    </p>
                  </div>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Submission Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium text-gray-800">
                        {new Date(
                          selectedSubmission.submissionTime
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-gray-800 capitalize">
                        {selectedSubmission.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSubmission.feedback && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Feedback
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <p className="text-gray-700">
                      {selectedSubmission.feedback.feedbackText}
                    </p>
                    {selectedSubmission.feedback.professorComments && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          Professor Comments:
                        </p>
                        <p className="text-gray-700 italic">
                          "{selectedSubmission.feedback.professorComments}"
                        </p>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Scores
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedSubmission.feedback.grammarScore !== null && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Grammar</p>
                        <p className="font-medium text-gray-800">
                          {selectedSubmission.feedback.grammarScore.toFixed(1)}%
                        </p>
                      </div>
                    )}
                    {selectedSubmission.feedback.readabilityScore !== null && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Readability</p>
                        <p className="font-medium text-gray-800">
                          {selectedSubmission.feedback.readabilityScore.toFixed(
                            1
                          )}
                          %
                        </p>
                      </div>
                    )}
                    {selectedSubmission.feedback.structureScore !== null && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Structure</p>
                        <p className="font-medium text-gray-800">
                          {selectedSubmission.feedback.structureScore.toFixed(
                            1
                          )}
                          %
                        </p>
                      </div>
                    )}
                    {selectedSubmission.feedback.logicScore !== null && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Logic</p>
                        <p className="font-medium text-gray-800">
                          {selectedSubmission.feedback.logicScore.toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Final Grade</p>
                        <p className="text-2xl font-bold text-gradient-primary">
                          {selectedSubmission.feedback.finalGrade.toFixed(1)} /
                          50
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Graded By</p>
                        <p className="font-medium text-gray-800">
                          {selectedSubmission.feedback.gradedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!selectedSubmission.feedback && (
                <Alert
                  type="info"
                  message="This submission has not been graded yet. Check back later for feedback."
                />
              )}
            </Card>

            <div className="mt-6">
              <GradientButton>Download Submission</GradientButton>
            </div>
          </div>
        ) : (
          <div>
            {submissions.length === 0 ? (
              <Card className="text-center py-10">
                <p className="text-gray-600 mb-4">
                  You haven't submitted any assignments yet.
                </p>
                <GradientButton>Browse Assignments</GradientButton>
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
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">
                            {submission.assignmentTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {submission.courseCode}: {submission.courseName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {new Date(
                              submission.submissionTime
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(submission.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            size="sm"
                            onClick={() => handleViewSubmission(submission)}
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

export default SubmissionsPage;
