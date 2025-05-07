import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransportManagerProfile() {
  const [profile, setProfile] = useState({
    jobTitle: '',
    firstName: '',
    lastName: '',
    username: '',
    address: '',
    phoneNumber: '',
    email: '',
    role: '',
    createdAt: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(''); // For form validation errors inside the form
  const [globalMessage, setGlobalMessage] = useState(null); // For success/error messages
  const [globalMessageType, setGlobalMessageType] = useState(""); // Type: "success", "error"

  useEffect(() => {
    fetchProfile();
  }, []);

  // Automatically clear global message after 3 seconds if it's a success or error
  useEffect(() => {
    if (globalMessage && (globalMessageType === "success" || globalMessageType === "error")) {
      const timer = setTimeout(() => {
        setGlobalMessage(null);
        setGlobalMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [globalMessage, globalMessageType]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setFormError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setGlobalMessage('No token found. Please log in.');
        setGlobalMessageType("error");
        return;
      }
      const response = await axios.get('http://localhost:5000/api/transport-manager/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to fetch profile. Please try again later.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}(-\d{1,5})?$/; // e.g., 1234567890 or 1234567890-12345

    if (!profile.firstName.trim()) {
      return "First Name is required.";
    }
    if (!profile.lastName.trim()) {
      return "Last Name is required.";
    }
    if (!profile.username.trim()) {
      return "Username is required.";
    }
    if (!profile.address.trim()) {
      return "Address is required.";
    }
    if (!profile.phoneNumber) {
      return "Phone Number is required.";
    }
    if (!phoneRegex.test(profile.phoneNumber)) {
      return "Please enter a valid phone number (e.g., 1234567890 or 1234567890-12345).";
    }
    if (!profile.email) {
      return "Email is required.";
    }
    if (!emailRegex.test(profile.email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleUpdate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setGlobalMessage('No token found. Please log in.');
        setGlobalMessageType("error");
        return;
      }
      await axios.put('http://localhost:5000/api/transport-manager/profile', profile, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setIsEditing(false);
      setGlobalMessage("Profile updated successfully!");
      setGlobalMessageType("success");
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to update profile. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const closeGlobalMessage = () => {
    setGlobalMessage(null);
    setGlobalMessageType("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Global Message Display (Success/Error) */}
        <AnimatePresence>
          {globalMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`fixed z-50 p-4 rounded-xl shadow-lg flex items-center justify-between max-w-md w-full transition-all duration-300 ${
                globalMessageType === "success"
                  ? "bg-green-100 border border-green-300 text-green-800 top-4 left-1/2 -translate-x-1/2"
                  : "bg-red-100 border border-red-300 text-red-800 top-4 left-1/2 -translate-x-1/2"
              }`}
            >
              <span className="font-medium">{globalMessage}</span>
              <button
                onClick={closeGlobalMessage}
                className="ml-4 text-xl font-bold hover:text-gray-600 focus:outline-none"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <h1 className="text-4xl font-extrabold text-green-900">
            Transport Manager Profile
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Manage your personal details
          </p>
        </motion.header>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-6 flex items-center">
            <FaUser className="mr-2 text-green-500" />
            Profile Details
          </h2>

          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : (
            <>
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{formError}</div>
              )}
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={profile.jobTitle}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={profile.role}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Job Title:</span>
                    <span className="text-gray-800">{profile.jobTitle}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">First Name:</span>
                    <span className="text-gray-800">{profile.firstName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Last Name:</span>
                    <span className="text-gray-800">{profile.lastName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Username:</span>
                    <span className="text-gray-800">{profile.username}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Address:</span>
                    <span className="text-gray-800">{profile.address}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Phone Number:</span>
                    <span className="text-gray-800">{profile.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Email:</span>
                    <span className="text-gray-800">{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Role:</span>
                    <span className="text-gray-800">{profile.role}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-600">Created At:</span>
                    <span className="text-gray-800">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={isLoading}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormError('');
                      }}
                      disabled={isLoading}
                      className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-all duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}