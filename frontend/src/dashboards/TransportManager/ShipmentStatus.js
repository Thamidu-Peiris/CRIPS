import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaShippingFast, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShipmentStatus() {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(''); // For form validation errors inside modal
  const [messages, setMessages] = useState([]); // Queue for success/error messages
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newLocation, setNewLocation] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // Store the action to confirm (status update)

  useEffect(() => {
    fetchShipments();
  }, []);

  // Automatically clear the oldest message after 3 seconds if it's a success or error
  useEffect(() => {
    if (messages.length > 0 && messages[0].type !== "confirm") {
      const timer = setTimeout(() => {
        setMessages((prev) => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const addMessage = (message, type) => {
    setMessages((prev) => [...prev, { message, type, id: Date.now() }]);
  };

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/shipments');
      setShipments(res.data);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      addMessage(error.response?.data?.error || 'Failed to fetch shipments. Please try again.', "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateLocation = () => {
    if (!newLocation.trim()) {
      return "Location is required.";
    }
    return null;
  };

  const handleStatusUpdate = async (id, status, delayReason = '') => {
    try {
      await axios.put(`http://localhost:5000/api/shipments/${id}`, { status, delayReason });
      await fetchShipments();
      addMessage("Shipment status updated successfully!", "success");
    } catch (error) {
      console.error('Failed to update shipment status:', error.response?.data || error.message);
      addMessage(error.response?.data?.error || 'Failed to update shipment status. Please try again.', "error");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  const handleLocationUpdate = (shipment) => {
    setSelectedShipment(shipment);
    setNewLocation(shipment.location || '');
    setIsModalOpen(true);
    setFormError('');
  };

  const submitLocationUpdate = async () => {
    if (!selectedShipment) return;

    const validationError = validateLocation();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      await axios.put(`http://localhost:5000/api/shipments/${selectedShipment._id}`, {
        location: newLocation,
        status: selectedShipment.status, // Preserve the current status
      });
      setIsModalOpen(false);
      setSelectedShipment(null);
      setNewLocation('');
      await fetchShipments();
      addMessage("Shipment location updated successfully!", "success");
    } catch (error) {
      console.error('Failed to update shipment location:', error.response?.data || error.message);
      setFormError(error.response?.data?.error || 'Failed to update shipment location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to show confirmation dialog
  const showConfirmation = (action, id, status = '', delayReason = '') => {
    setConfirmAction({ action, id, status, delayReason });
    setMessages((prev) => [
      ...prev,
      { 
        message: `Are you sure you want to mark this shipment as ${status === 'Delivered' ? 'delivered' : 'delayed'}?`,
        type: "confirm",
        id: Date.now()
      }
    ]);
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (confirmAction.action === 'statusUpdate') {
      handleStatusUpdate(confirmAction.id, confirmAction.status, confirmAction.delayReason);
    }
  };

  // Function to close a specific message
  const closeMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (confirmAction) {
      setConfirmAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6 relative">
        {/* Global Message Display (Success/Error/Confirmation) */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md space-y-2">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`relative p-4 rounded-xl shadow-lg flex items-center justify-between w-full transition-all duration-300 ${
                  msg.type === "success"
                    ? "bg-green-100 border border-green-300 text-green-800"
                    : msg.type === "error"
                    ? "bg-red-100 border border-red-300 text-red-800"
                    : "bg-gray-100 border border-gray-300 text-gray-800 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                }`}
              >
                <span className="font-medium">{msg.message}</span>
                <div className="flex space-x-2">
                  {msg.type === "confirm" && (
                    <>
                      <button
                        onClick={handleConfirm}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => closeMessage(msg.id)}
                        className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition-all duration-200"
                      >
                        No
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => closeMessage(msg.id)}
                    className="ml-4 text-xl font-bold hover:text-gray-600 focus:outline-none"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <h1 className="text-4xl font-extrabold text-green-900">
            Shipment Status Tracking
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Monitor and update the status of shipments
          </p>
        </motion.header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
              <FaShippingFast className="mr-2 text-green-500" />
              Shipment Status
            </h3>
            {isLoading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : shipments.length === 0 ? (
              <div className="text-center text-gray-600">No shipments available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-gray-800 font-semibold">Shipment ID</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Orders</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Vehicle</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Driver</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Departure</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Expected Arrival</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Location</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Status</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((shipment) => (
                      <motion.tr
                        key={shipment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                      >
                        <td className="py-3 px-4">{shipment.shipmentId}</td>
                        <td className="py-3 px-4">
                          {shipment.orders && shipment.orders.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {shipment.orders.map((order) => (
                                <li key={order._id} className="text-sm">
                                  {order._id} ({order.shippingInfo.city}, {order.shippingInfo.country}) - Status: {order.status}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'No orders'
                          )}
                        </td>
                        <td className="py-3 px-4">{shipment.vehicleId}</td>
                        <td className="py-3 px-4">{shipment.driverId}</td>
                        <td className="py-3 px-4">{new Date(shipment.departureDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Date(shipment.expectedArrivalDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{shipment.location || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              shipment.status === 'Delivered'
                                ? 'bg-green-100 text-green-700'
                                : shipment.status === 'In Transit'
                                ? 'bg-yellow-100 text-yellow-700'
                                : shipment.status === 'Delayed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {shipment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => handleLocationUpdate(shipment)}
                            disabled={shipment.status === 'Delivered'}
                            className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                              shipment.status === 'Delivered'
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                            title={shipment.status === 'Delivered' ? 'Cannot update location for delivered shipments' : 'Update Location'}
                          >
                            <FaMapMarkerAlt />
                          </button>
                          {(shipment.status === 'In Transit' || shipment.status === 'Delayed') && (
                            <>
                              <button
                                onClick={() => showConfirmation('statusUpdate', shipment._id, 'Delivered')}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                              >
                                Delivered
                              </button>
                              {shipment.status === 'In Transit' && (
                                <button
                                  onClick={() => showConfirmation('statusUpdate', shipment._id, 'Delayed', 'Traffic delay')}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                                >
                                  Delay
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {isModalOpen && selectedShipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
              >
                <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-green-500" />
                  Update Shipment Location
                </h2>
                {formError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{formError}</div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Current Location</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Enter new location (e.g., Colombo)"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 mt-6">
                  <button
                    onClick={submitLocationUpdate}
                    disabled={isLoading}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Update Location'}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedShipment(null);
                      setNewLocation('');
                      setFormError('');
                    }}
                    className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}