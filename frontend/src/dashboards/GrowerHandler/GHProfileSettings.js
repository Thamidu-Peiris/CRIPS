// frontend\src\dashboards\GrowerHandler\GHProfileSettings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import GHSidebar from "../../components/GHSidebar";
import GHNavbar from "../../components/GHNavbar";

const SrProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("[DEBUG] Starting Grower Handler profile fetch...");
      console.log("[DEBUG] LocalStorage values:");
      console.log("  userId:", userId);
      console.log("  token:", token);
      console.log("  role:", role);

      if (!userId || !token) {
        setError("Please log in to view your profile");
        console.log("[DEBUG] Missing userId or token, redirecting to login");
        navigate("/login");
        return;
      }

      if (!role || role.toLowerCase() !== "grower handler") {
        setError("Access denied. This page is for Groer Handler only.");
        console.log("[DEBUG] Role mismatch, redirecting to shop");
        navigate("/grower-handler/profile-settings");
        return;
      }

      try {
        console.log("[DEBUG] Sending GET request to:", `http://localhost:5000/api/grower-handler/profile/${userId}`);
        console.log("[DEBUG] Request headers:", {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });

        const response = await axios.get(`http://localhost:5000/api/grower-handler/profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("[DEBUG] Profile fetch response status:", response.status);
        console.log("[DEBUG] Profile fetch response data:", response.data);

        if (response.data && Object.keys(response.data).length > 0) {
          setProfile(response.data);
          console.log("[DEBUG] Profile data set successfully");
        } else {
          setError("No profile data returned from server.");
          console.log("[DEBUG] No data in response");
        }
      } catch (err) {
        console.error("[DEBUG] Fetch error:", err.response?.data || err.message);
        console.error("[DEBUG] Fetch error status:", err.response?.status);
        console.error("[DEBUG] Fetch error headers:", err.response?.headers);
        setError(err.response?.status === 404 ? "Profile not found for this user." : "Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, [userId, token, role, navigate]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
      <GHSidebar />
      <main className="flex-1 p-4 lg:p-8">
        <GHNavbar />
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">Profile Settings</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-md transition-all duration-300">
              {error}
            </div>
          )}

          {/* Profile Card */}
          {profile ? (
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center mb-8">
                <img
                  src={profile.profileImage ? `http://localhost:5000${profile.profileImage}` : "/default-profile.png"}
                  alt="Profile"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-green-100 shadow-md mb-4 sm:mb-0 sm:mr-6 transition-transform duration-300 hover:scale-105"
                  onError={(e) => (e.target.src = "/default-profile.png")}
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-3xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-gray-500 text-lg mt-1">{profile.role || "Sales Manager"}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <FaUser className="text-green-500 mr-3 text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Username</p>
                      <p className="text-gray-600 font-medium">{profile.username || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <FaEnvelope className="text-green-500 mr-3 text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Email</p>
                      <p className="text-gray-600 font-medium">{profile.email || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <FaPhone className="text-green-500 mr-3 text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Phone</p>
                      <p className="text-gray-600 font-medium">{profile.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <FaMapMarkerAlt className="text-green-500 mr-3 text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Address</p>
                      <p className="text-gray-600 font-medium">{profile.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
                <button
                  onClick={() => navigate("/grower-handler/update-profile")}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Update Profile
                </button>
                <button
                  onClick={() => navigate("/grower-handler/change-password")}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            !error && (
              <div className="text-center text-gray-500 text-lg">
                <p>Loading profile...</p>
                <div className="mt-4 flex justify-center">
                  <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default SrProfileSettings;