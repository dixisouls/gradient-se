import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  const { currentUser } = useAuth();

  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
