import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboards/SM/sideBar';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaEdit, FaTrash } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api/smManageCustomer';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    address: '',
    phoneNumber: '',
    companyName: '',
    businessAddress: '',
    taxId: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [managerName, setManagerName] = useState('');
  const navigate = useNavigate();

  // Fetch manager name and customers on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.firstName && user.lastName) {
      setManagerName(`${user.firstName} ${user.lastName}`);
    } else {
      setManagerName('System Manager');
    }
    fetchCustomers();
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_BASE_URL);
      console.log('API Response:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Failed to fetch customers. Please try again.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.companyName &&
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open View Modal
  const openViewModal = async (customer) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${customer._id}`);
      setSelectedCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError(error.response?.data?.message || 'Failed to fetch customer details.');
    }
  };

  // Close View Modal
  const closeViewModal = () => {
    setSelectedCustomer(null);
  };

  // Open Edit Modal
  const openEditModal = async (customer) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${customer._id}`);
      setSelectedCustomer(response.data);
      setEditedCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError(error.response?.data?.message || 'Failed to fetch customer details for editing.');
    }
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setSelectedCustomer(null);
    setEditedCustomer({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      address: '',
      phoneNumber: '',
      companyName: '',
      businessAddress: '',
      taxId: '',
      status: '',
    });
  };

  // Handle input change in Edit Modal
  const handleInputChange = (e) => {
    setEditedCustomer({ ...editedCustomer, [e.target.name]: e.target.value });
  };

  // Update customer
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const response = await axios.put(
        `${API_BASE_URL}/${selectedCustomer._id}`,
        editedCustomer
      );
      setCustomers(
        customers.map((customer) =>
          customer._id === selectedCustomer._id ? response.data : customer
        )
      );
      setSuccessMessage('Customer updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error('Error updating customer:', error);
      setError(error.response?.data?.message || 'Failed to update customer.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a customer
  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        await axios.delete(`${API_BASE_URL}/${id}`);
        setCustomers(customers.filter((customer) => customer._id !== id));
        setSuccessMessage('Customer deleted successfully!');
        closeViewModal();
      } catch (error) {
        console.error('Error deleting customer:', error);
        setError(error.response?.data?.message || 'Failed to delete customer.');
      } finally {
        setLoading(false);
      }
    }
  };

  const CustomerModal = ({ customer, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...customer });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(customer._id, formData);
      setIsEditing(false);
    };

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            {isEditing ? 'Update Customer' : 'Customer Details'}
          </h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Business Address</label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tax ID</label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 rounded-xl transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white py-3 rounded-xl transition duration-300"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Name:</strong> {`${customer.firstName} ${customer.lastName}`}
                </p>
              </div>
              <div className="flex items-center">
                <FaUser className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Username:</strong> {customer.username}
                </p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Email:</strong> {customer.email}
                </p>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Address:</strong> {customer.address || 'N/A'}
                </p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Phone Number:</strong> {customer.phoneNumber || 'N/A'}
                </p>
              </div>
              <div className="flex items-center">
                <FaBuilding className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Company Name:</strong> {customer.companyName || 'N/A'}
                </p>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Business Address:</strong> {customer.businessAddress || 'N/A'}
                </p>
              </div>
              <div className="flex items-center">
                <FaBuilding className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Tax ID:</strong> {customer.taxId || 'N/A'}
                </p>
              </div>
              <div className="flex items-center">
                <FaBuilding className="text-cyan-400 mr-3 text-xl" />
                <p className="text-lg text-gray-300">
                  <strong>Status:</strong> {customer.status}
                </p>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center"
                >
                  <FaEdit className="mr-2" /> Update
                </button>
                <button
                  onClick={() => onDelete(customer._id)}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white py-3 rounded-xl transition duration-300 mt-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                System Manager Dashboard - Manage Customers
              </h1>
              <p className="text-xl mt-2 font-light">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate('/sm-dashboard')}
              className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
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

        {/* Customer Management Section */}
        <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Customer Management</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or company name..."
              className="w-full md:w-1/3 p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Customer List */}
          {loading ? (
            <p className="text-center text-gray-300">Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-300">No customers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer._id}
                  onClick={() => openViewModal(customer)}
                  className="bg-gray-900/50 p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-2xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <p className="text-gray-400">{customer.email}</p>
                      <p className="text-gray-400">{customer.companyName || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Modal */}
        {selectedCustomer && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={closeViewModal}
            onUpdate={(id, data) => {
              setEditedCustomer(data);
              handleUpdateCustomer({ preventDefault: () => {} });
            }}
            onDelete={handleDeleteCustomer}
          />
        )}
      </div>
    </div>
  );
};

export default ManageCustomers;