// frontend/src/dashboards/GrowerHandler/GHChangePassword.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";

const GHChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    console.log("[DEBUG] Checking access for GHChangePassword...");
    console.log("[DEBUG] LocalStorage values:", { userId, token, role });

    if (!userId || !token) {
      setError("Please log in to change your password");
      navigate("/login");
      return;
    }

    if (role !== "Grower Handler") {
      setError("Access denied. This page is for Grower Handlers only.");
      navigate("/shop");
      return;
    }
  }, [userId, token, role, navigate]);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirmation do not match");
      setSuccess("");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/grower-handler/change-password/${userId}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Password changed successfully!");
      setError("");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/grower-handler/profile-settings");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password. Please try again.");
      setSuccess("");
      console.error("[DEBUG] Change password error:", error.response?.data || error.message);
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
              <label className="block">
                <span className="font-semibold">Confirm New Password:</span>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={passwordData.confirmPassword}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </label>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/grower-handler/profile-settings")}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
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