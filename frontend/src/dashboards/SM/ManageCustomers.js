import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboards/SM/sideBar';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = 'http://localhost:5000/api/smManageCustomer';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [managerName, setManagerName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
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

  // Open Delete Confirmation Modal
  const openDeleteConfirm = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setCustomerToDelete(null);
  };

  // Delete a customer
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      await axios.delete(`${API_BASE_URL}/${customerToDelete._id}`);
      setCustomers(customers.filter((customer) => customer._id !== customerToDelete._id));
      setSuccessMessage('Customer deleted successfully!');
      closeDeleteConfirm();
      closeViewModal();
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError(error.response?.data?.message || 'Failed to delete customer.');
    } finally {
      setLoading(false);
    }
  };

  // Export customer list as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Customer List - CRIPS Inventory System', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = [
      "Name",
      "Email",
      "Company Name",
      "Phone Number",
      "Address",
      "Business Address",
      "Tax ID",
      "Status"
    ];
    const tableRows = [];

    filteredCustomers.forEach(customer => {
      const customerData = [
        `${customer.firstName} ${customer.lastName}`,
        customer.email,
        customer.companyName || '',
        customer.phoneNumber || '',
        customer.address || '',
        customer.businessAddress || '',
        customer.taxId || '',
        customer.status
      ];
      tableRows.push(customerData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
      margin: { top: 40 },
    });

    doc.save('customer-list.pdf');
  };

  const CustomerModal = ({ customer, onClose, onDelete }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">
            Customer Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <FaUser className="text-green-500 mr-3 text-xl" />
              <p className="text-lg text-gray-600">
                <strong>Name:</strong> {`${customer.firstName} ${customer.lastName}`}
              </p>
            </div>
            <div className="flex items-center">
              <FaUser className="text-green-500 mr-3 text-xl" />
              <p className="text-lg text-gray-600">
                <strong>Username:</strong> {customer.username}
              </p>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-green-500 mr-3 text-xl" />
              <p className="text-lg text-gray-600">
                <strong>Email:</strong> {customer.email}
              </p>
            </div>
            {customer.address && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Address:</strong> {customer.address}
                </p>
              </div>
            )}
            {customer.phoneNumber && (
              <div className="flex items-center">
                <FaPhone className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Phone Number:</strong> {customer.phoneNumber}
                </p>
              </div>
            )}
            {customer.companyName && (
              <div className="flex items-center">
                <FaBuilding className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Company Name:</strong> {customer.companyName}
                </p>
              </div>
            )}
            {customer.businessAddress && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Business Address:</strong> {customer.businessAddress}
                </p>
              </div>
            )}
            {customer.taxId && (
              <div className="flex items-center">
                <FaBuilding className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Tax ID:</strong> {customer.taxId}
                </p>
              </div>
            )}
            <div className="flex items-center">
              <FaBuilding className="text-green-500 mr-3 text-xl" />
              <p className="text-lg text-gray-600">
                <strong>Status:</strong> {customer.status}
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => onDelete(customer)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition duration-300 mt-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Confirm Deletion</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this customer? This action cannot be undone.</p>
          <div className="flex space-x-4">
            <button
              onClick={onConfirm}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-teal-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-300 to-teal-500 text-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-green-900">
                System Manager Dashboard - Manage Customers
              </h1>
              <p className="text-xl mt-2 font-light text-gray-100">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate('/sm-dashboard')}
              className="flex items-center bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>
        </div>

        {/* Error, Success, and Loading Messages */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-xl">
            <p>{successMessage}</p>
          </div>
        )}
        {loading && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-xl">
            <p>Loading...</p>
          </div>
        )}

        {/* Customer Management Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-green-900">Customer Management</h2>
            <button
              onClick={exportToPDF}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              Export to PDF
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or company name..."
              className="w-full md:w-1/3 p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Customer List */}
          {!loading && filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-600">No customers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer._id}
                  onClick={() => openViewModal(customer)}
                  className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-2xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <p className="text-gray-600">{customer.email}</p>
                      {customer.companyName && (
                        <p className="text-gray-600">{customer.companyName}</p>
                      )}
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
            onDelete={(customer) => openDeleteConfirm(customer)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <ConfirmationModal
            onConfirm={handleDeleteCustomer}
            onCancel={closeDeleteConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default ManageCustomers;