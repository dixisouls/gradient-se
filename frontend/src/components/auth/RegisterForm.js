import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../common/Alert";
import Button from "../common/Button";
import GradientButton from "../common/GradientButton";
import TermsModal from "../modals/TermsModal";
import PrivacyModal from "../modals/PrivacyModal";

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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setAgreeToTerms(e.target.checked);
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      isValid:
        minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial,
      errors: {
        minLength: !minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumber: !hasNumber,
        hasSpecial: !hasSpecial,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      let errorMsg = "Password must include:";
      if (passwordValidation.errors.minLength)
        errorMsg += " at least 8 characters,";
      if (passwordValidation.errors.hasUpperCase)
        errorMsg += " one uppercase letter,";
      if (passwordValidation.errors.hasLowerCase)
        errorMsg += " one lowercase letter,";
      if (passwordValidation.errors.hasNumber) errorMsg += " one number,";
      if (passwordValidation.errors.hasSpecial)
        errorMsg += " one special character,";

      // Remove trailing comma and add period
      errorMsg = errorMsg.slice(0, -1) + ".";

      setErrorMessage(errorMsg);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage(
        "You must agree to the Terms of Service and Privacy Policy to create an account"
      );
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
    <div className="w-full max-w-2xl px-4">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-transparent bg-clip-text">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
              {formData.password && (
                <div className="mt-2 text-sm">
                  <p className="font-medium mb-1">Password must contain:</p>
                  <ul className="space-y-1 ml-1">
                    <li
                      className={`flex items-center ${
                        formData.password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${
                          formData.password.length >= 8
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${
                        /[A-Z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${
                          /[A-Z]/.test(formData.password)
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[a-z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${
                          /[a-z]/.test(formData.password)
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      One lowercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[0-9]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${
                          /[0-9]/.test(formData.password)
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      One number
                    </li>
                    <li
                      className={`flex items-center ${
                        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                          formData.password
                        )
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                            formData.password
                          )
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      One special character
                    </li>
                  </ul>
                </div>
              )}
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
              <div className="flex flex-wrap space-x-4 mt-2">
                <label className="flex items-center mb-2">
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

                <label className="flex items-center mb-2">
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

            <div className="md:col-span-2 mt-4">
              <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg border border-gradient-primary/20">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5 text-gradient-primary focus:ring-gradient-secondary rounded border-gray-300 cursor-pointer"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-700 cursor-pointer"
                    >
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-gradient-primary hover:text-gradient-secondary underline font-semibold"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-gradient-primary hover:text-gradient-secondary underline font-semibold"
                      >
                        Privacy Policy
                      </button>
                    </label>
                    <p className="text-gray-500 mt-1">
                      By creating an account, you acknowledge that you have read
                      and understood our policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <GradientButton
              type="submit"
              fullWidth
              disabled={loading || !agreeToTerms}
            >
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

      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};

export default RegisterForm;
