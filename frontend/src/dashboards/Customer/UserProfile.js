import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader"; // Adjust the import path based on your structure
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
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

      {/* 🔹 Breadcrumb Navigation */}
      <div className="text-gray-500 mb-4 p-6">
        <Link to="/" className="hover:underline">Home</Link> / Profile
      </div>

      {/* 🔹 Profile Content */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Your Profile</h2>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              onError={(e) => {
                e.target.src = "/default-profile.png";
              }}
            />
            <p className="text-gray-700 font-medium mt-2">{username}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <p className="w-full p-2 border rounded-lg bg-gray-50 text-gray-600">{email}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <p className="w-full p-2 border rounded-lg bg-gray-50 text-gray-600">{firstName}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <p className="w-full p-2 border rounded-lg bg-gray-50 text-gray-600">{lastName}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <p className="w-full p-2 border rounded-lg bg-gray-50 text-gray-600">
              {phoneNumber || "Not provided"}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <p className="w-full p-2 border rounded-lg bg-gray-50 text-gray-600">
              {address || "Not provided"}
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/dashboard/settings"
              className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              <FaUserCircle className="mr-2" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;