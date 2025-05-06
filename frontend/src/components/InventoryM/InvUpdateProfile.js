import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InventoryNavbar from './InventoryNavbar';
import InventorySidebar from './InventorySidebar';

export default function InvUpdateProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory-manager/profile/${userId}`);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || '',
        });
        if (response.data.profileImage) {
          setPreviewImage(`http://localhost:5000${response.data.profileImage}`);
        }
      } catch (error) {
        setError('Failed to fetch profile data.');
        setTimeout(() => setError(''), 3000);
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
      formDataToSend.append('profileImage', selectedFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/inventory-manager/profile/update/${userId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('✅ Profile updated successfully!');
      setError('');

      const updatedUser = {
        ...JSON.parse(localStorage.getItem('userInfo') || '{}'),
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileImage: response.data.updatedUser.profileImage || '',
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate('/inv-profile');
      }, 2000);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setMessage('');
      setTimeout(() => setError(''), 3000);
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <InventorySidebar />
      <main className="flex-1 p-6 ml-72">
        <InventoryNavbar />
        {error && (
          <div className="bg-red-100 text-red-800 font-semibold p-4 rounded mb-6 text-center max-w-7xl mx-auto">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-800 font-semibold p-4 rounded mb-6 text-center max-w-7xl mx-auto">
            {message}
          </div>
        )}
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Update Profile 🌱</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-green-800 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full p-3 border border-green-300 rounded bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 w-24 h-24 rounded-full object-cover mx-auto"
                />
              )}
            </div>
            <div>
              <label className="block font-semibold text-green-800 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-green-800 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-green-800 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-green-800 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
            >
              ➕ Update Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}