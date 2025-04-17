import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CourseList from "../components/courses/CourseList";
import CourseForm from "../components/courses/CourseForm";
import Sidebar from "../components/layout/Sidebar";
import GradientButton from "../components/common/GradientButton";

const CoursesPage = ({ showCreateForm: initialShowCreateForm = false }) => {
  const { currentUser } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(initialShowCreateForm);
  const location = useLocation();
  const isProfessor = currentUser?.role === "professor";

  // Check if we have state passed from navigation that should show the form
  useEffect(() => {
    if (location.state?.showCreateForm) {
      setShowCreateForm(true);
    }
  }, [location.state]);

  // Also update form visibility if the prop changes
  useEffect(() => {
    if (initialShowCreateForm) {
      setShowCreateForm(true);
    }
  }, [initialShowCreateForm]);

  const handleCreateCourse = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden pt-16 md:pt-4">
        {isProfessor && showCreateForm ? (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
              Create New Course
            </h2>
            <CourseForm onCancel={() => setShowCreateForm(false)} />
          </div>
        ) : (
          <div>
            {isProfessor && (
              <div className="mb-4 md:mb-6">
                <GradientButton
                  onClick={handleCreateCourse}
                  className="w-auto px-6 py-2 text-base"
                >
                  Create New Course
                </GradientButton>
              </div>
            )}

            <CourseList />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
