// CRIPS\frontend\src\dashboards\CSM\ProfileSettings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

const ProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("[DEBUG] Starting CSM profile fetch...");
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

      // ✅ FIX: Make the role check case-insensitive and handle empty role
if (!role || role.toLowerCase() !== "customer service manager") {
  setError("Access denied. This page is for CSMs only.");
  console.log("[DEBUG] Role mismatch, redirecting to shop");
  navigate("/shop");
  return;
}


      try {
        console.log("[DEBUG] Sending GET request to:", `http://localhost:5000/api/csm/profile/${userId}`);
        console.log("[DEBUG] Request headers:", {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });

        const response = await axios.get(`http://localhost:5000/api/csm/profile/${userId}`, {
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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <CSMSidebar />
      <div className="flex-1 flex flex-col">
        <CSMNavbar />
        <div className="p-6 lg:p-8">
          <h2 className="text-3xl font-bold text-green-600 mb-6 tracking-tight">CSM Profile Settings</h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Profile Card */}
          {profile ? (
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center mb-6">
                <img
                  src={profile.profileImage ? `http://localhost:5000${profile.profileImage}` : "/default-profile.png"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-200 mb-4 sm:mb-0 sm:mr-6"
                  onError={(e) => (e.target.src = "/default-profile.png")}
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-semibold text-gray-800">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-gray-500 text-lg">{profile.role || "Customer Service Manager"}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong className="font-medium text-gray-900">Username:</strong>{" "}
                  <span className="text-gray-600">{profile.username || "N/A"}</span>
                </p>
                <p>
                  <strong className="font-medium text-gray-900">Email:</strong>{" "}
                  <span className="text-gray-600">{profile.email || "N/A"}</span>
                </p>
                <p>
                  <strong className="font-medium text-gray-900">Phone Number:</strong>{" "}
                  <span className="text-gray-600">{profile.phoneNumber || "Not provided"}</span>
                </p>
                <p>
                  <strong className="font-medium text-gray-900">Address:</strong>{" "}
                  <span className="text-gray-600">{profile.address || "Not provided"}</span>
                </p>
              </div>

              {/* Update Button */}
              <button
                onClick={() => navigate("/update-profile")}
                className="mt-6 w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Update Profile
              </button>
            </div>
          ) : (
            !error && (
              <div className="text-center text-gray-500 text-lg">
                <p>Loading profile...</p>
                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;