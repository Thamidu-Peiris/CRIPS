// frontend\src\dashboards\GrowerHandler\GHUpdateProfile.js
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/grower-handler/profile/${userId}`);
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
        console.error(error);
      }
    };
    fetchProfile();
  }, [userId]);

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
          },
        }
      );

      setSuccess("Profile updated successfully!");
      setError("");

      // Update localStorage with new user info
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("userInfo")),
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileImage: response.data.updatedUser.profileImage || "",
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate("/grower-handler/profile-settings");
      }, 2000);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      setSuccess("");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <GHSidebar />
      <main className="flex-1 p-6">
        <GHNavbar />
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-8 transition-all duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 tracking-tight">Update Profile</h2>
          {error && (
            <p className="text-red-600 bg-red-100 p-4 rounded-lg text-center mb-6 animate-fade-in">{error}</p>
          )}
          {success && (
            <p className="text-green-600 bg-green-100 p-4 rounded-lg text-center mb-6 animate-fade-in">{success}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              />
              {previewImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-md"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Update Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default GHUpdateProfile;