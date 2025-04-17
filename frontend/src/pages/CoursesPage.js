import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CourseList from "../components/courses/CourseList";
import CourseForm from "../components/courses/CourseForm";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";

const CoursesPage = () => {
  const { currentUser } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const isProfessor = currentUser?.role === "professor";

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden pt-16 md:pt-4 md:ml-64">
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
                <Button onClick={() => setShowCreateForm(true)}>
                  Create New Course
                </Button>
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
