//CRIPS\frontend\src\dashboards\CSM\ProfileSettings.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar"
import CSMSidebar from "../../components/CSMSidebar"; 

const ProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (!userId) {
        alert("User ID not found! Please log in again.");
        navigate("/employee-login");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/jobs/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error.response ? error.response.data : error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar - Positioned on the left */}
      <CSMSidebar />

      <div className="flex-1 p-6">
        {/* ✅ Navbar - Positioned at the top */}
        <CSMNavbar />

        {/* ✅ Profile Details Content */}
        <div className="max-w-xl mx-auto py-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile Settings</h2>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Profile Details</h3>

            {loading ? (
              <p className="text-center text-gray-600">Loading profile...</p>
            ) : profile ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="font-semibold">Username:</span>
                  <input
                    type="text"
                    value={profile.username}
                    disabled
                    className="w-full border p-2 rounded-lg bg-gray-100"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold">First Name:</span>
                  <input
                    type="text"
                    value={profile.firstName}
                    disabled
                    className="w-full border p-2 rounded-lg bg-gray-100"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold">Last Name:</span>
                  <input
                    type="text"
                    value={profile.lastName}
                    disabled
                    className="w-full border p-2 rounded-lg bg-gray-100"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold">Email:</span>
                  <input
                    type="text"
                    value={profile.email}
                    disabled
                    className="w-full border p-2 rounded-lg bg-gray-100"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold">Address:</span>
                  <input
                    type="text"
                    value={profile.address}
                    disabled
                    className="w-full border p-2 rounded-lg bg-gray-100"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold">Phone Number:</span>
                  <input
                    type="text"
                    value={profile.phoneNumber}
                    disabled
                    className="w-full border p-2 rounded-lg bg-gray-100"
                  />
                </label>
              </div>
            ) : (
              <p className="text-center text-red-600">Failed to load profile.</p>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/update-profile")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
