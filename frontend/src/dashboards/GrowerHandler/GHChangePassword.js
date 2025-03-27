// CRIPS\frontend\src\dashboards\GrowerHandler\GHChangePassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";

const GHChangePassword = () => {
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/jobs/profile/change-password/${userId}`,
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Password changed successfully!");
      setError("");
      setPasswordData({ currentPassword: "", newPassword: "" });

      setTimeout(() => {
        navigate("/grower-handler/change-password");
      }, 2000);
    } catch (error) {
      setError("Failed to change password. Please try again.");
      setSuccess("");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <GHSidebar />
      <div className="flex-1 p-0">
        <GHNavbar />
        <div className="max-w-2xl mx-auto py-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Change Password</h2>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {error && <p className="text-red-600 text-center">{error}</p>}
            {success && <p className="text-green-600 text-center">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="font-semibold">Current Password:</span>
                <input
                  type="password"
                  name="currentPassword"
                  onChange={handleChange}
                  value={passwordData.currentPassword}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </label>
              <label className="block">
                <span className="font-semibold">New Password:</span>
                <input
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  value={passwordData.newPassword}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </label>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/grower-handler-dashboard")}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GHChangePassword;