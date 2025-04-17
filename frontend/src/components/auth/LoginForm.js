import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../common/Alert";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-center text-2xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-transparent bg-clip-text">
          Login to GRADiEnt
        </h2>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <div>
            <GradientButton type="submit" fullWidth disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </GradientButton>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gradient-primary hover:text-gradient-secondary"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
