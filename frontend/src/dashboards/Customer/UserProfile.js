import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader";
import { motion } from "framer-motion";

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
            <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> / Profile
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Your Profile</h2>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto animate-fade-in">
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-200 hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              <p className="text-gray-800 font-semibold text-lg mt-2">{username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <p className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800">{email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <p className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800">{firstName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <p className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800">{lastName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800">
                {phoneNumber || <span className="text-gray-600 italic">Not provided</span>}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <p className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800">
                {address || <span className="text-gray-600 italic">Not provided</span>}
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                to="/dashboard/settings"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;