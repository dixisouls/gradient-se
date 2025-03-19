import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../common/Alert";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    role: "student",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage("Failed to register. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-center text-3xl font-bold mb-8 bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-transparent bg-clip-text">
          Create Your GRADiEnt Account
        </h2>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
            className="mb-6"
          />
        )}

        {successMessage && (
          <Alert type="success" message={successMessage} className="mb-6" />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="input-label">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your first name"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="last_name" className="input-label">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your last name"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="input-label">
                Phone Number (Optional)
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                disabled={loading}
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="input-label">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
                disabled={loading}
                required
                minLength={8}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="role" className="input-label">
                Role
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span>Student</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="professor"
                    checked={formData.role === "professor"}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span>Professor</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <GradientButton type="submit" fullWidth disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </GradientButton>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gradient-primary hover:text-gradient-secondary"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
