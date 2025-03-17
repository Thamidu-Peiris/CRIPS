//CRIPS\frontend\src\dashboards\CSM\UpdateProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";  // ✅ Import Navbar
import CSMSidebar from "../../components/CSMSidebar";  // ✅ Import Sidebar

const UpdateProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/profile/${userId}`);
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/jobs/profile/update/${userId}`, profile);
      alert("Profile updated successfully!");
      navigate("/profile-settings"); // Redirect back after update
    } catch (error) {
      alert("Error updating profile.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar - Positioned on the left */}
      <CSMSidebar />

      <div className="flex-1 p-6">
        {/* ✅ Navbar - Positioned at the top */}
        <CSMNavbar />

        {/* ✅ Profile Update Content */}
        <div className="max-w-2xl mx-auto py-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Profile</h2>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <label className="block">
                  <span className="font-semibold">First Name:</span>
                  <input type="text" value={profile.firstName || ""}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full border p-2 rounded-lg" required />
                </label>

                <label className="block">
                  <span className="font-semibold">Last Name:</span>
                  <input type="text" value={profile.lastName || ""}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full border p-2 rounded-lg" required />
                </label>

                <label className="block">
                  <span className="font-semibold">Address:</span>
                  <input type="text" value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full border p-2 rounded-lg" />
                </label>

                <label className="block">
                  <span className="font-semibold">Phone Number:</span>
                  <input type="text" value={profile.phoneNumber || ""}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    className="w-full border p-2 rounded-lg" />
                </label>

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => navigate("/customer-service-dashboard")} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save Changes</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
