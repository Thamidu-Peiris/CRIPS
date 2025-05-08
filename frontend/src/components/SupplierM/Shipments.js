import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

const Shipments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmShip, setConfirmShip] = useState(null);
  const supplierId = localStorage.getItem('supplierId') || 'default-supplier-id'; // Fallback for testing

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/supplier-dashboard/orders/${supplierId}`);
        setOrders(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorMessage('Failed to fetch orders: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [supplierId]);

  // Fetch supplier profile to get shipmentAddress and other details
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supplier-dashboard/profile/${supplierId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Failed to fetch profile: ' + (error.response?.data?.message || error.message));
      }
    };
    fetchProfile();
  }, [supplierId]);

  const handleShip = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/supplier-dashboard/orders/${orderId}/ship`, {
        shipmentAddress: profile?.shipmentAddress || 'Not specified',
        name: profile?.supplierName || 'Not specified',
        companyName: profile?.supplierCompany || 'Not specified',
        contactNumber: profile?.contactNo || 'Not specified',
        email: profile?.email || 'Not specified',
      });
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.updatedOrder : order
      ));
      setConfirmShip(null);
      setSuccessMessage('Order shipped successfully!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error shipping order:', error);
      setErrorMessage('Failed to ship order: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-green-900 mb-8">Shipments</h1>
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow">
            {successMessage}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-green-800 text-lg bg-green-100 p-6 rounded-lg shadow">
            No shipments available.
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-4 text-left text-sm font-semibold">Order ID</th>
                    <th className="p-4 text-left text-sm font-semibold">Item Type</th>
                    <th className="p-4 text-left text-sm font-semibold">Quantity</th>
                    <th className="p-4 text-left text-sm font-semibold">Unit</th>
                    <th className="p-4 text-left text-sm font-semibold">Delivery Date</th>
                    <th className="p-4 text-left text-sm font-semibold">Status</th>
                    <th className="p-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className={`border-b ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'} hover:bg-green-100 transition duration-200`}
                    >
                      <td className="p-4 text-green-800">{order._id}</td>
                      <td className="p-4 text-green-800">{order.itemType || 'N/A'}</td>
                      <td className="p-4 text-green-800">{order.quantity || 'N/A'}</td>
                      <td className="p-4 text-green-800">{order.unit || 'N/A'}</td>
                      <td className="p-4 text-green-800">
                        {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'accepted'
                              ? 'bg-green-200 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.status === 'accepted' && (
                          <button
                            onClick={() => setConfirmShip(order._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow"
                          >
                            Ship
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmShip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-green-900 mb-4">Confirm Shipment</h2>
              <p className="text-green-800 mb-6">
                Are you sure you want to ship this order (ID: {confirmShip})?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleShip(confirmShip)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Yes, Ship
                </button>
                <button
                  onClick={() => setConfirmShip(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipments;