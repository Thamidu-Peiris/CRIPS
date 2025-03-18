// CRIPS\frontend\src\dashboards\Customer\UserProfileSettings.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader"; // Adjust the import path based on your structure
import { FaLock, FaCamera, FaUserCircle } from "react-icons/fa";


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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
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
        alert("Account deleted successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  const handleChangePassword = () => {
    navigate("/customer/change-password");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100">
      {/* 🔹 Navbar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>

        {/* 🔹 Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/orders" className="text-gray-600">Orders</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>


        {/* 🔹 Customer Header */}
        <CustomerHeader />

      </nav>

      {/* 🔹 Breadcrumb Navigation (Optional, based on OrdersPage.js) */}
      <div className="text-gray-500 mb-4 p-6">
        <Link to="/" className="hover:underline">Home</Link> / Profile Settings
      </div>

      {/* 🔹 Profile Settings Content */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Profile Settings</h2>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full cursor-pointer">
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <FaCamera className="text-gray-600" />
              </label>
            </div>
            <p className="text-gray-700 font-medium mt-2">{username}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email Address (confirmed)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleChangePassword}
              className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <FaLock className="mr-2" /> Change Password
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center px-4 py-2 bg-red-200 rounded-lg hover:bg-red-300 text-red-600"
            >
              <FaUserCircle className="mr-2" /> Delete Account
            </button>
          </div>

          <button
            onClick={handleSaveChanges}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;