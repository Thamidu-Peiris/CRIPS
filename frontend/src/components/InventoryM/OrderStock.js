// frontend/src/dashboards/InventoryM/OrderStock.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Navbar'; // Adjust path based on your structure
import { FaArrowLeft, FaBox, FaTruck, FaCalendarAlt } from 'react-icons/fa';

const OrderStock = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    quantity: '',
    deliveryDate: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [managerName, setManagerName] = useState('');
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
        setManagerName('Inventory Manager');
      }
    } catch (err) {
      console.error('Error parsing userInfo from localStorage:', err);
      navigate('/login');
      return;
    }
    if (!userInfo || userInfo.role !== 'InventoryManager') {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch stock items
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/order-stock/stocks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setStocks(response.data.stocks);
        } else {
          setError('Failed to fetch stock items');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stock items');
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
    fetchStocks();
  }, [navigate]);

  // Fetch suppliers when a plant is selected
  useEffect(() => {
    if (!selectedPlant) return;

    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const selectedStock = stocks.find(stock => stock.plantName === selectedPlant);
        const response = await axios.get('http://localhost:5000/api/order-stock/suppliers', {
          params: { itemType: selectedStock.itemType }, // Use itemType ("Plant") to match suppliers
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setSuppliers(response.data.suppliers);
          setSelectedSupplier(''); // Reset selected supplier when plant changes
        } else {
          setError('Failed to fetch suppliers');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch suppliers');
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [selectedPlant, stocks]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlant || !selectedSupplier || !orderDetails.quantity || !orderDetails.deliveryDate) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      const selectedStock = stocks.find(stock => stock.plantName === selectedPlant);
      const payload = {
        plantName: selectedPlant, // Send plantName instead of itemType
        quantity: parseInt(orderDetails.quantity),
        unit: selectedStock.unit,
        deliveryDate: orderDetails.deliveryDate,
        supplierId: selectedSupplier,
      };
      const response = await axios.post('http://localhost:5000/api/order-stock/submit', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSuccessMessage('Order submitted successfully!');
        setSelectedPlant('');
        setSelectedSupplier('');
        setOrderDetails({ quantity: '', deliveryDate: '' });
        setSuppliers([]);
      } else {
        setError('Failed to submit order');
      }
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit order');
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
              <h1 className="text-4xl font-extrabold tracking-tight">Inventory Manager Dashboard - Order Stock</h1>
              <p className="text-xl mt-2 font-light">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate('/inventory-dashboard')} // Adjust path as needed
              className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
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

        {/* Order Form */}
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Order New Stock</h2>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Select Plant */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Plant to Order <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                disabled={loading}
              >
                <option value="">-- Select a Plant --</option>
                {stocks.map((stock) => (
                  <option key={stock._id} value={stock.plantName}>
                    {stock.plantName}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Supplier */}
            {selectedPlant && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Supplier <span className="text-red-400">*</span>
                </label>
                {suppliers.length === 0 ? (
                  <p className="text-gray-400">No suppliers found for {selectedPlant}.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suppliers.map((supplier) => (
                      <div
                        key={supplier._id}
                        onClick={() => setSelectedSupplier(supplier._id)}
                        className={`p-4 rounded-xl border cursor-pointer transition duration-300 ${
                          selectedSupplier === supplier._id
                            ? 'border-cyan-500 bg-cyan-500/20'
                            : 'border-gray-700 hover:border-cyan-400 hover:bg-gray-700'
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
                        <p className="text-gray-300">{supplier.companyName || 'N/A'}</p>
                        <p className="text-gray-400 text-sm">{supplier.email}</p>
                        <p className="text-gray-400 text-sm">{supplier.contactNumber}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Order Details */}
            {selectedSupplier && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Order Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quantity <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={orderDetails.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className="w-full p-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Delivery Date <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="deliveryDate"
                        value={orderDetails.deliveryDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                        required
                        disabled={loading}
                      />
                      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-colors duration-300 font-medium flex items-center"
              disabled={loading || !selectedSupplier}
            >
              <FaTruck className="mr-2" /> {loading ? 'Submitting...' : 'Submit Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderStock;