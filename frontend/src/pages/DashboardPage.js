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
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        {isStudent ? <StudentDashboard /> : <ProfessorDashboard />}
      </div>
    </div>
  );
};

export default DashboardPage;
