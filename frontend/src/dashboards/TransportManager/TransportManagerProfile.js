import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/transport-manager/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      setError('Failed to fetch profile. Please try again later.');
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      await axios.put('http://localhost:5000/api/transport-manager/profile', profile, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-72 p-8">
        <header className="p-6 bg-gradient-to-r from-cyan-600/90 to-blue-700/90 rounded-2xl shadow-xl backdrop-blur-md border border-cyan-500/20">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Transport Manager Profile
          </h1>
          <p className="text-lg mt-2 font-light text-cyan-100/80">
            Manage your personal details
          </p>
        </header>

        <div className="mt-8 bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-8">Profile Details</h2>

          {isLoading ? (
            <div className="text-center text-cyan-300">Loading...</div>
          ) : error ? (
            <div className="text-red-400 mb-4">{error}</div>
          ) : isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-200 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={profile.role}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/30 rounded-lg text-white border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300"
                  disabled
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Job Title:</span>
                <span className="text-gray-200">{profile.jobTitle}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">First Name:</span>
                <span className="text-gray-200">{profile.firstName}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Last Name:</span>
                <span className="text-gray-200">{profile.lastName}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Username:</span>
                <span className="text-gray-200">{profile.username}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Address:</span>
                <span className="text-gray-200">{profile.address}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Phone Number:</span>
                <span className="text-gray-200">{profile.phoneNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Email:</span>
                <span className="text-gray-200">{profile.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Role:</span>
                <span className="text-gray-200">{profile.role}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-cyan-200">Created At:</span>
                <span className="text-gray-200">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}