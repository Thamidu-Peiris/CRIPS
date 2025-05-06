import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InventoryNavbar from "./InventoryNavbar";
import InventorySidebar from "./InventorySidebar";

const InvChangePassword = () => {
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match.");
      setMessage("");
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/inventory-manager/profile/change-password/${userId}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage("✅ Password changed successfully!");
      setError("");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/inv-profile");
      }, 2000);
    } catch (error) {
      setError("Failed to change password. Please try again.");
      setMessage("");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <InventorySidebar />
      <div className="flex-1 ml-72">
        <InventoryNavbar />
        <div className="p-6">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Change Password 🌱</h2>
            {error && (
              <div className="bg-red-200 text-red-900 font-semibold p-4 rounded mb-4">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-100 text-green-800 font-semibold p-4 rounded mb-4">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold text-green-800 mb-1">Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  onChange={handleChange}
                  value={passwordData.currentPassword}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-green-800 mb-1">New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  value={passwordData.newPassword}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-green-800 mb-1">Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={passwordData.confirmPassword}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/inventory-manager-dashboard")}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
                >
                  ➕ Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvChangePassword;