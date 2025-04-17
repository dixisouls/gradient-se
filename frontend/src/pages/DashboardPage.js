import React from "react";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import ProfessorDashboard from "../components/dashboard/ProfessorDashboard";
import Sidebar from "../components/layout/Sidebar";
import Loading from "../components/common/Loading";

const DashboardPage = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  const isStudent = currentUser?.role === "student";

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden pt-16 md:pt-4 md:ml-64">
        {isStudent ? <StudentDashboard /> : <ProfessorDashboard />}
      </div>
    </div>
  );
};

export default DashboardPage;
