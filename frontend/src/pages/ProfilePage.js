import React from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import ProfileForm from "../components/profile/ProfileForm";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";

const ProfilePage = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-8 flex justify-center items-center pt-16 md:pt-4 md:ml-64">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-8 pt-16 md:pt-4 md:ml-64">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Profile Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main profile form */}
          <div className="lg:col-span-2">
            <ProfileForm />
          </div>

          {/* Account summary */}
          <div>
            <Card title="Account Summary" className="mb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-800">
                    {new Date(currentUser?.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium text-gray-800">
                    {currentUser?.last_login
                      ? new Date(currentUser.last_login).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {currentUser?.role}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Notification Settings">
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-gradient-primary"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">
                    Email notifications
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-gradient-primary"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">
                    Assignment reminders
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-gradient-primary"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">
                    Feedback notifications
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-gradient-primary"
                  />
                  <span className="ml-2 text-gray-700">
                    Course announcements
                  </span>
                </label>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
