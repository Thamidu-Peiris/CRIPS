// frontend/src/dashboards/GrowerHandler/GHUpdateProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";

const GHUpdateProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("[DEBUG] Starting GH profile fetch for update...");
      console.log("[DEBUG] LocalStorage values:", { userId, token, role });

      if (!userId || !token) {
        setError("Please log in to update your profile");
        navigate("/login");
        return;
      }

      if (role !== "Grower Handler") {
        setError("Access denied. This page is for Grower Handlers only.");
        navigate("/shop");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/grower-handler/profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          address: response.data.address || "",
          phoneNumber: response.data.phoneNumber || "",
        });
        if (response.data.profileImage) {
          setPreviewImage(`http://localhost:5000${response.data.profileImage}`);
        }
      } catch (error) {
        setError("Failed to fetch profile data.");
        console.error("[DEBUG] Fetch error:", error.response?.data || error.message);
      }
    };
    fetchProfile();
  }, [userId, token, role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    if (selectedFile) {
      formDataToSend.append("profileImage", selectedFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/grower-handler/profile/update/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Profile updated successfully!");
      setError("");

      // Update localStorage with new user info
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...currentUser,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        profileImage: response.data.updatedUser.profileImage || currentUser.profileImage,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userInfoChanged")); // Trigger navbar update

      setTimeout(() => {
        navigate("/grower-handler/profile-settings");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
      setSuccess("");
      console.error("[DEBUG] Update error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <GHSidebar />
      <div className="flex-1 p-0">
        <GHNavbar />
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Profile</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full p-3 border rounded-lg bg-gray-100"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 w-32 h-32 rounded-full object-cover mx-auto"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GHUpdateProfile;