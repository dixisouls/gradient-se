import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { access_token } = await authService.login(email, password);
      localStorage.setItem("token", access_token);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      navigate("/dashboard");
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || "Login failed");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await authService.register(userData);
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(userData);
      setCurrentUser(updatedUser);
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to update profile");
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
