import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";
import { FaLock, FaCamera, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
      setEmail(storedUserInfo.email || "");
      setFirstName(storedUserInfo.firstName || "");
      setLastName(storedUserInfo.lastName || "");
      setPhoneNumber(storedUserInfo.phoneNumber || "");
      setAddress(storedUserInfo.address || "");
      setUsername(storedUserInfo.username || "");
      const imagePath = storedUserInfo.profileImage
        ? `http://localhost:5000${storedUserInfo.profileImage}`
        : "/default-profile.png";
      setProfileImage(imagePath);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    try {
      const response = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      setUserInfo(response.data.user);
      const newImagePath = response.data.user.profileImage
        ? `http://localhost:5000${response.data.user.profileImage}`
        : "/default-profile.png";
      setProfileImage(newImagePath);
      setMessage("Profile updated successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        await axios.delete("http://localhost:5000/api/users/delete", {
          data: { email: userInfo.email },
        });
        localStorage.removeItem("userInfo");
        setMessage("Account deleted successfully!");
        setMessageType("success");
        setTimeout(() => navigate("/login"), 3000); // Navigate after showing message
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("Failed to delete account.");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleChangePassword = () => {
    navigate("/customer/change-password");
  };

  return (
    <div className="min-h-screen bg-green-50 pt-0">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-12 transition-transform hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/dashboard/orders"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Orders
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Content */}
      <div className="px-4 pb-12">
        <div className="bg-white shadow-sm p-4 mx-4 mt-4 rounded-lg">
          <div className="text-gray-500 text-sm">
            <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> / Profile Settings
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Profile Settings</h2>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto animate-fade-in">
          {message && (
            <div
              className={`p-6 rounded-lg text-center font-bold animate-fade-in mb-6 ${
                messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-200 hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.src = "/default-profile.png";
                  }}
                />
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <FaCamera />
                </label>
              </div>
              <p className="text-gray-800 font-semibold text-lg mt-2">{username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (confirmed)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-800"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleChangePassword}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                <FaLock className="mr-2 text-gray-600" /> Change Password
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 hover:scale-105 transition-all duration-300"
              >
                <FaUserCircle className="mr-2 text-red-600" /> Delete Account
              </button>
            </div>

            <button
              onClick={handleSaveChanges}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;