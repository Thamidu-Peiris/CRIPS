import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboards/SM/sideBar'; // Adjust the path based on your project structure
import { FaSearch, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const ApproveSuppliers = () => {
  const [pendingSuppliers, setPendingSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [managerName, setManagerName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Check user authentication and role
  useEffect(() => {
    let userInfo;
    try {
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name) {
        setManagerName(user.name);
      } else {
        setManagerName('System Manager');
      }
    } catch (err) {
      console.error('Error parsing userInfo from localStorage:', err);
      navigate('/login');
      return;
    }
    if (!userInfo || userInfo.role !== 'SystemManager') {
      console.log('Redirecting to login: userInfo or role mismatch');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch pending suppliers on component mount
  useEffect(() => {
    const fetchPendingSuppliers = async () => {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = localStorage.getItem('token');
      if (!userInfo || !token) {
        console.log('No userInfo or token found, redirecting to login');
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/suppliers/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const updatedSuppliers = (response.data.suppliers || []).map(supplier => ({
            ...supplier,
            status: supplier.status || 'pending',
          }));
          // Sort suppliers by createdAt in descending order (newest first)
          updatedSuppliers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPendingSuppliers(updatedSuppliers);
          setFilteredSuppliers(updatedSuppliers);
        } else {
          setError('Failed to fetch pending suppliers');
        }
      } catch (err) {
        console.error('Error fetching pending suppliers:', err);
        setError(err.response?.data?.message || 'Failed to fetch pending suppliers');
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('Redirecting to login: Unauthorized or Forbidden');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSuppliers();
  }, [navigate]);

  // Filter suppliers based on search query
  useEffect(() => {
    const filtered = pendingSuppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (supplier.companyName && supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredSuppliers(filtered);
  }, [searchQuery, pendingSuppliers]);

  // Handle approve/reject action
  const handleAction = async (supplierId, status) => {
    const confirmMessage = status === 'approved'
      ? 'Are you sure you want to approve this supplier?'
      : 'Are you sure you want to reject this supplier?';
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage('');
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/suppliers/status/${supplierId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccessMessage(`Supplier ${status} successfully!`);
        const updatedSuppliers = pendingSuppliers.map(supplier =>
          supplier._id === supplierId ? { ...supplier, status } : supplier
        );
        // Re-sort after updating status to maintain newest-first order
        updatedSuppliers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPendingSuppliers(updatedSuppliers);
      } else {
        setError('Failed to update supplier status');
      }
    } catch (err) {
      console.error(`Error updating supplier status to ${status}:`, err);
      setError(err.response?.data?.message || `Failed to update supplier status to ${status}`);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">System Manager Dashboard - Approve Suppliers</h1>
              <p className="text-xl mt-2 font-light">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate('/sm-dashboard')}
              className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or company name..."
              className="w-full p-3 pl-10 border border-gray-700 rounded-xl bg-gray-900/50 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-500/20 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/20 border-l-4 border-green-500 text-green-300 p-4 mb-6 rounded-xl">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Suppliers List */}
        {loading ? (
          <p className="text-center text-gray-300">Loading suppliers...</p>
        ) : filteredSuppliers.length === 0 ? (
          <p className="text-center text-gray-300">No pending supplier requests to review.</p>
        ) : (
          <div className="space-y-6">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-cyan-400">{supplier.name}</h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      supplier.status.toLowerCase() === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : supplier.status.toLowerCase() === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    } flex items-center`}
                  >
                    {supplier.status.toLowerCase() === 'approved' && <FaCheckCircle className="mr-1" />}
                    {supplier.status.toLowerCase() === 'pending' && <FaHourglassHalf className="mr-1" />}
                    {supplier.status.toLowerCase() === 'rejected' && <FaTimesCircle className="mr-1" />}
                    {supplier.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300">
                      <strong className="text-white">Supplier ID:</strong> {supplier.supplierId}
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Company Name:</strong> {supplier.companyName || 'N/A'}
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Username:</strong> {supplier.username}
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Email:</strong> {supplier.email}
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Contact Number:</strong> {supplier.contactNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">
                      <strong className="text-white">Address:</strong> {supplier.address}
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Supplies:</strong>
                    </p>
                    <ul className="list-disc pl-5 text-gray-300">
                      {supplier.supplies.map((supply, index) => (
                        <li key={index} className="mb-2">
                          {supply.itemType} - {supply.quantity} {supply.unit}
                          {supply.description && ` (${supply.description})`}
                          <br />
                          <img
                            src={`http://localhost:5000/${supply.photo}`}
                            alt={supply.itemType}
                            className="w-16 h-16 object-cover mt-1 rounded"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {supplier.status.toLowerCase() === 'pending' ? (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleAction(supplier._id, 'approved')}
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-teal-600 transition-colors duration-300 font-medium flex items-center"
                      disabled={loading}
                    >
                      <FaCheckCircle className="mr-2" /> {loading ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleAction(supplier._id, 'rejected')}
                      className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-xl hover:from-pink-600 hover:to-red-600 transition-colors duration-300 font-medium flex items-center"
                      disabled={loading}
                    >
                      <FaTimesCircle className="mr-2" /> {loading ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-400">Action not available for status: {supplier.status}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveSuppliers;