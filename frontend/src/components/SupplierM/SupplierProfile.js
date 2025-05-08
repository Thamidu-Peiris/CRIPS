import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const SupplierProfile = () => {
  const [profile, setProfile] = useState({
    supplierName: '',
    supplierCompany: '',
    contactNo: '',
    email: '',
    shipmentAddress: '',
    bankDetails: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const supplierId = localStorage.getItem('supplierId'); // Fetch supplierId from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!supplierId) {
      navigate('/sign-in');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supplier-dashboard/profile/${supplierId}`);
        setProfile(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Failed to fetch profile: ' + (error.response?.data?.message || error.message));
      }
    };
    fetchProfile();
  }, [supplierId, navigate]);

  const handleTextChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!profile.supplierName || !profile.supplierCompany || !profile.contactNo || !profile.email) {
        setErrorMessage('Supplier Name, Supplier Company, Contact No, and Email are required.');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/supplier-dashboard/profile/${supplierId}`,
        profile
      );

      console.log('Response from backend:', response.data);

      if (response.data.updatedProfile) {
        setProfile(response.data.updatedProfile);
        setIsEditing(false);
        setErrorMessage('');
      } else {
        setErrorMessage('No updated profile data returned from the server.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Supplier Profile</h1>
        <div className="bg-white shadow p-6 rounded-lg">
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-800">Supplier Name *</label>
                <input
                  type="text"
                  name="supplierName"
                  value={profile.supplierName}
                  onChange={handleTextChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800">Supplier Company *</label>
                <input
                  type="text"
                  name="supplierCompany"
                  value={profile.supplierCompany}
                  onChange={handleTextChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800">Contact No *</label>
                <input
                  type="text"
                  name="contactNo"
                  value={profile.contactNo}
                  onChange={handleTextChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleTextChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800">Company Address</label>
                <textarea
                  name="shipmentAddress"
                  value={profile.shipmentAddress}
                  onChange={handleTextChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800">Bank Details</label>
                <textarea
                  name="bankDetails"
                  value={profile.bankDetails}
                  onChange={handleTextChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p><strong>Supplier Name:</strong> {profile.supplierName || 'Not set'}</p>
              <p><strong>Supplier Company:</strong> {profile.supplierCompany || 'Not set'}</p>
              <p><strong>Contact No:</strong> {profile.contactNo || 'Not set'}</p>
              <p><strong>Email:</strong> {profile.email || 'Not set'}</p>
              <p><strong>Company Address:</strong> {profile.shipmentAddress || 'Not set'}</p>
              <p><strong>Bank Details:</strong> {profile.bankDetails || 'Not set'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;