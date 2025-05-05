import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GradientButton from "../components/common/GradientButton";

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-white mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Empower Your Learning with Instant Feedback
              </h1>
              <p className="text-xl mb-8">
                GRADiEnt uses AI to provide immediate, detailed feedback on your
                assignments, helping students learn faster and instructors teach
                more effectively.
              </p>

              {currentUser ? (
                <Link to="/dashboard">
                  <GradientButton
                    size="lg"
                    className="bg-white text-gradient-primary hover:bg-gray-100 border-2 border-white"
                  >
                    Go to Dashboard
                  </GradientButton>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/register">
                    <GradientButton
                      size="lg"
                      className="bg-white text-gradient-primary hover:bg-gray-100 border-2 border-white"
                    >
                      Get Started
                    </GradientButton>
                  </Link>
                  <Link to="/login">
                    <button className="py-3 px-6 border-2 border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
                      Login
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-transparent bg-clip-text">
                    How GRADiEnt Works
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white font-bold text-lg">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Submit Your Work
                      </h3>
                      <p className="text-gray-600">
                        Upload your assignments through our simple interface.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white font-bold text-lg">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        AI Analysis
                      </h3>
                      <p className="text-gray-600">
                        Our AI analyzes your work for grammar, structure, logic,
                        and more.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white font-bold text-lg">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Instant Feedback
                      </h3>
                      <p className="text-gray-600">
                        Receive detailed feedback immediately, no waiting for
                        manual grading.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white font-bold text-lg">
                      4
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Improve & Resubmit
                      </h3>
                      <p className="text-gray-600">
                        Apply the feedback to improve your work and resubmit if
                        needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how GRADiEnt enhances the educational experience for both
              students and educators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Instant Feedback
              </h3>
              <p className="text-gray-600">
                Get detailed feedback within seconds of submission, allowing for
                immediate improvements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Assignment Tracking
              </h3>
              <p className="text-gray-600">
                Stay on top of deadlines with automated reminders and assignment
                status tracking.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600">
                Advanced AI analyzes everything from essay structure to code
                logic with remarkable accuracy.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Personalized Suggestions
              </h3>
              <p className="text-gray-600">
                Receive customized recommendations to improve your writing,
                coding, and presentation skills.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Progress Analytics
              </h3>
              <p className="text-gray-600">
                Track your improvement over time with detailed analytics and
                performance insights.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Time-Saving Grading
              </h3>
              <p className="text-gray-600">
                Instructors save hours with automated preliminary grading that
                streamlines the review process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students and professors who use GRADiEnt to transform
              their educational experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Sarah Johnson</h3>
                  <p className="text-gray-600">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "GRADiEnt has transformed how I learn to code. Instead of
                waiting days for feedback, I get instant guidance on my coding
                assignments. My debugging skills have improved dramatically!"
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">
                    Prof. David Miller
                  </h3>
                  <p className="text-gray-600">History Department</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As an instructor, GRADiEnt has given me back hours of my time.
                The AI handles initial feedback while I can focus on deeper
                conceptual guidance. My students are more engaged than ever."
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gradient-primary to-gradient-secondary flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Maria Garcia</h3>
                  <p className="text-gray-600">English Literature Major</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The detailed feedback on my essays has helped me become a
                better writer. I can see exactly where I need to improve and
                make changes before submission. My grades have improved
                significantly!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students and educators using GRADiEnt to enhance
            their academic journey.
          </p>

          {currentUser ? (
            <Link to="/dashboard">
              <button className="bg-white text-gradient-primary font-medium rounded-md py-3 px-8 hover:bg-gray-100 transition-colors">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register">
                <button className="bg-white text-gradient-primary font-medium rounded-md py-3 px-8 hover:bg-gray-100 transition-colors">
                  Sign Up for Free
                </button>
              </Link>
              <Link to="/login">
                <button className="border-2 border-white text-white font-medium rounded-md py-3 px-8 hover:bg-white hover:bg-opacity-10 transition-colors">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
