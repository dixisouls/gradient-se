import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import GradientButton from "../components/common/GradientButton";
import Alert from "../components/common/Alert";

const GradingPage = () => {
  const { currentUser } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState("all");

  // Sample submission data based on the database schema
  const submissions = [
    {
      id: 1,
      assignmentId: 1,
      assignmentTitle: "Python Basics",
      courseName: "Introduction to Computer Science",
      courseCode: "CS101",
      studentName: "Sarah Jones",
      studentEmail: "jones.sarah@university.edu",
      submissionTime: "2025-03-17T15:30:00Z",
      isLate: false,
      status: "submitted",
      aiGraded: true,
      submissionText: `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)`,
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
        finalGrade: null,
        gradedBy: "GRADiEnt AI",
        professorReview: false,
        professorComments: null,
      },
    },
    {
      id: 2,
      assignmentId: 1,
      assignmentTitle: "Python Basics",
      courseName: "Introduction to Computer Science",
      courseCode: "CS101",
      studentName: "Wei Zhang",
      studentEmail: "zhang.wei@university.edu",
      submissionTime: "2025-03-16T14:15:00Z",
      isLate: false,
      status: "submitted",
      aiGraded: true,
      submissionText: `def factorial(n):
    result = 1
    for i in range(1, n+1):
        result *= i
    return result`,
      feedback: {
        id: 2,
        feedbackText:
          "Good implementation of the iterative factorial function. The code is efficient and correct.",
        grammarScore: null,
        readabilityScore: null,
        structureScore: null,
        logicScore: 95.0,
        similarityScore: 90.0,
        suggestedGrade: 45.0,
        finalGrade: null,
        gradedBy: "GRADiEnt AI",
        professorReview: false,
        professorComments: null,
      },
    },
    {
      id: 3,
      assignmentId: 3,
      assignmentTitle: "Research Paper",
      courseName: "Advanced Composition",
      courseCode: "ENG201",
      studentName: "Alex Williams",
      studentEmail: "williams.alex@university.edu",
      submissionTime: "2025-03-14T12:45:00Z",
      isLate: false,
      status: "submitted",
      aiGraded: true,
      submissionText: null, // File submission, no text
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
        finalGrade: null,
        gradedBy: "GRADiEnt AI",
        professorReview: false,
        professorComments: null,
      },
    },
    {
      id: 4,
      assignmentId: 5,
      assignmentTitle: "Matrix Operations",
      courseName: "Linear Algebra",
      courseCode: "MATH303",
      studentName: "Mike Johnson",
      studentEmail: "johnson.mike@university.edu",
      submissionTime: "2025-03-18T09:15:00Z",
      isLate: false,
      status: "submitted",
      aiGraded: true,
      submissionText:
        "Matrix A = [[1,2],[3,4]]\nMatrix B = [[5,6],[7,8]]\nA + B = [[6,8],[10,12]]",
      feedback: {
        id: 4,
        feedbackText:
          "The matrix addition is correctly calculated, but you should show your work more clearly.",
        grammarScore: null,
        readabilityScore: 75.0,
        structureScore: 70.0,
        logicScore: 90.0,
        similarityScore: 85.0,
        suggestedGrade: 25.5,
        finalGrade: null,
        gradedBy: "GRADiEnt AI",
        professorReview: false,
        professorComments: null,
      },
    },
    {
      id: 5,
      assignmentId: 2,
      assignmentTitle: "Algorithm Analysis",
      courseName: "Introduction to Computer Science",
      courseCode: "CS101",
      studentName: "Miguel Rodriguez",
      studentEmail: "rodriguez.miguel@university.edu",
      submissionTime: "2025-03-19T10:30:00Z",
      isLate: false,
      status: "submitted",
      aiGraded: false,
      submissionText: null, // File submission, no text
      feedback: null,
    },
  ];

  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === "all") return true;
    if (filter === "pending_ai" && !submission.aiGraded) return true;
    if (
      filter === "pending_review" &&
      submission.aiGraded &&
      !submission.feedback?.professorReview
    )
      return true;
    if (filter === "completed" && submission.feedback?.professorReview)
      return true;
    return false;
  });

  const getStatusBadge = (submission) => {
    if (!submission.aiGraded) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          Pending AI Grading
        </span>
      );
    } else if (!submission.feedback?.professorReview) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Needs Review
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Graded
        </span>
      );
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleSaveGrade = () => {
    alert("Grading functionality will be implemented in a future update.");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Grading Center
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
                  {getStatusBadge(selectedSubmission)}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Student Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-800">
                        {selectedSubmission.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">
                        {selectedSubmission.studentEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="font-medium text-gray-800">
                        {new Date(
                          selectedSubmission.submissionTime
                        ).toLocaleString()}
                        {selectedSubmission.isLate && (
                          <span className="ml-2 text-xs text-red-600 font-medium">
                            (Late)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Submission
                </h3>
                {selectedSubmission.submissionText ? (
                  <div className="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                    {selectedSubmission.submissionText}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 italic">
                      File submission - preview not available
                    </p>
                    <Button className="mt-2" size="sm">
                      Download Submission
                    </Button>
                  </div>
                )}
              </div>

              {selectedSubmission.feedback && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    AI Feedback
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <p className="text-gray-700">
                      {selectedSubmission.feedback.feedbackText}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Scores
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

                  <div className="p-4 bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 rounded-md mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          AI Suggested Grade
                        </p>
                        <p className="text-2xl font-bold text-gradient-primary">
                          {selectedSubmission.feedback.suggestedGrade.toFixed(
                            1
                          )}{" "}
                          / 50
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!selectedSubmission.aiGraded && (
                <Alert
                  type="info"
                  message="This submission is waiting for AI grading, which usually takes less than 5 minutes. Check back soon."
                  className="mb-6"
                />
              )}

              {selectedSubmission.aiGraded && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Professor Assessment
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comments to Student
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gradient-primary"
                      rows="4"
                      placeholder="Add your comments here"
                      defaultValue={
                        selectedSubmission.feedback?.professorComments || ""
                      }
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Final Grade
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gradient-primary"
                          min="0"
                          max="50"
                          step="0.1"
                          defaultValue={
                            selectedSubmission.feedback?.suggestedGrade || 0
                          }
                        />
                        <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                          / 50
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-gradient-primary focus:ring-gradient-primary"
                          defaultChecked={false}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Apply penalties for late submission
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex gap-3">
              <GradientButton onClick={handleSaveGrade}>
                Save and Publish Grade
              </GradientButton>
              <Button
                variant="outline"
                onClick={() => setSelectedSubmission(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <Card>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Filter Submissions
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={filter === "all" ? "primary" : "outline"}
                      onClick={() => setFilter("all")}
                    >
                      All ({submissions.length})
                    </Button>
                    <Button
                      size="sm"
                      variant={filter === "pending_ai" ? "primary" : "outline"}
                      onClick={() => setFilter("pending_ai")}
                    >
                      Pending AI (
                      {submissions.filter((s) => !s.aiGraded).length})
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        filter === "pending_review" ? "primary" : "outline"
                      }
                      onClick={() => setFilter("pending_review")}
                    >
                      Needs Review (
                      {
                        submissions.filter(
                          (s) => s.aiGraded && !s.feedback?.professorReview
                        ).length
                      }
                      )
                    </Button>
                    <Button
                      size="sm"
                      variant={filter === "completed" ? "primary" : "outline"}
                      onClick={() => setFilter("completed")}
                    >
                      Completed (
                      {
                        submissions.filter((s) => s.feedback?.professorReview)
                          .length
                      }
                      )
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {filteredSubmissions.length === 0 ? (
              <Card className="text-center py-10">
                <p className="text-gray-600 mb-4">
                  No submissions match the current filter.
                </p>
                <Button onClick={() => setFilter("all")}>
                  View All Submissions
                </Button>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
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
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">
                            {submission.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.studentEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-800">
                            {submission.assignmentTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {submission.courseCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {new Date(
                              submission.submissionTime
                            ).toLocaleDateString()}
                            {submission.isLate && (
                              <span className="ml-1 text-xs text-red-600 font-medium">
                                (Late)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(submission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            size="sm"
                            onClick={() => handleViewSubmission(submission)}
                          >
                            {submission.aiGraded ? "Review" : "View"}
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

export default GradingPage;
