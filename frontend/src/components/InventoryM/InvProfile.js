import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InventoryNavbar from './InventoryNavbar';
import InventorySidebar from './InventorySidebar';

export default function InvProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('[DEBUG] Starting Inventory Manager profile fetch...');
      console.log('[DEBUG] LocalStorage values:');
      console.log('  userId:', userId);
      console.log('  token:', token);
      console.log('  role:', role);

      if (!userId || !token) {
        setError('Please log in to view your profile');
        console.log('[DEBUG] Missing userId or token, redirecting to login');
        navigate('/login');
        return;
      }

      if (!role || role.toLowerCase() !== 'inventorymanager') {
        setError('Access denied. This page is for Inventory Managers only.');
        console.log('[DEBUG] Role mismatch, redirecting to shop');
        navigate('/shop');
        return;
      }

      // Ensure userInfo exists for InventoryNavbar
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        console.log('No userInfo found in localStorage, setting default');
        localStorage.setItem('userInfo', JSON.stringify({ firstName: 'Inventory', lastName: 'Manager' }));
      }

      try {
        console.log('[DEBUG] Sending GET request to:', `http://localhost:5000/api/inventory-manager/profile/${userId}`);
        console.log('[DEBUG] Request headers:', {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        });

        const response = await axios.get(`http://localhost:5000/api/inventory-manager/profile/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('[DEBUG] Profile fetch response status:', response.status);
        console.log('[DEBUG] Profile fetch response data:', response.data);

        if (response.data && Object.keys(response.data).length > 0) {
          setProfile(response.data);
          console.log('[DEBUG] Profile data set successfully');
        } else {
          setError('No profile data returned from server.');
          setTimeout(() => setError(''), 3000);
          console.log('[DEBUG] No data in response');
        }
      } catch (err) {
        console.error('[DEBUG] Fetch error:', err.response?.data || err.message);
        console.error('[DEBUG] Fetch error status:', err.response?.status);
        console.error('[DEBUG] Fetch error headers:', err.response?.headers);
        setError(err.response?.status === 404 ? 'Profile not found for this user.' : 'Failed to fetch profile data.');
        setTimeout(() => setError(''), 3000);
      }
    };

    fetchProfile();
  }, [userId, token, role, navigate]);

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
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Inventory Manager Profile 🌱</h2>

          {profile ? (
            <div>
              <div className="flex flex-col items-center mb-6">
                <img
                  src={profile.profileImage ? `http://localhost:5000${profile.profileImage}` : '/default-profile.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-200 mb-4"
                  onError={(e) => (e.target.src = '/default-profile.png')}
                />
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-green-800">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-gray-500 text-lg">{profile.role || 'Inventory Manager'}</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong className="font-semibold text-green-800">Username:</strong>{' '}
                  <span className="text-gray-600">{profile.username || 'N/A'}</span>
                </p>
                <p>
                  <strong className="font-semibold text-green-800">Email:</strong>{' '}
                  <span className="text-gray-600">{profile.email || 'N/A'}</span>
                </p>
                <p>
                  <strong className="font-semibold text-green-800">Phone Number:</strong>{' '}
                  <span className="text-gray-600">{profile.phoneNumber || 'Not provided'}</span>
                </p>
                <p>
                  <strong className="font-semibold text-green-800">Address:</strong>{' '}
                  <span className="text-gray-600">{profile.address || 'Not provided'}</span>
                </p>
              </div>

              <button
                onClick={() => navigate('/inv-update-profile')}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
              >
                Update Profile
              </button>
            </div>
          ) : (
            !error && (
              <div className="text-center text-gray-500 text-lg">
                <p>Loading profile...</p>
                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}