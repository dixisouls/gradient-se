import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Card from "../common/Card";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";

const ProfileForm = () => {
  const { currentUser, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || "",
    last_name: currentUser?.last_name || "",
    phone_number: currentUser?.phone_number || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    setLoading(true);

    try {
      const success = await updateProfile(formData);

      if (success) {
        setSuccessMessage("Profile updated successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Personal Information" gradientBorder>
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage("")}
          className="mb-6"
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
          className="mb-6"
        />
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
              type="email"
              value={currentUser?.email || ""}
              className="input-field bg-gray-50"
              disabled
              readOnly
            />
            <p className="mt-1 text-sm text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label htmlFor="phone_number" className="input-label">
              Phone Number (Optional)
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number || ""}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="input-label">
            Role
          </label>
          <input
            id="role"
            type="text"
            value={
              currentUser?.role
                ? currentUser.role.charAt(0).toUpperCase() +
                  currentUser.role.slice(1)
                : ""
            }
            className="input-field bg-gray-50"
            disabled
            readOnly
          />
          <p className="mt-1 text-sm text-gray-500">Role cannot be changed</p>
        </div>

        <div className="flex justify-end mt-6">
          <GradientButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </GradientButton>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;
