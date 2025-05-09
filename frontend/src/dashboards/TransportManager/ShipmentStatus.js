import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaShippingFast, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ShipmentStatus() {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/shipments');
      setShipments(res.data);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      setErrorMessage('Failed to fetch shipments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, delayReason = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await axios.put(`http://localhost:5000/api/shipments/${id}/status`, { status, delayReason });
      fetchShipments();
    } catch (error) {
      console.error('Failed to update shipment status:', error);
      setErrorMessage('Failed to update shipment status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await axios.delete(`http://localhost:5000/api/shipments/${id}`);
      fetchShipments();
    } catch (error) {
      console.error('Failed to delete shipment:', error);
      setErrorMessage('Failed to delete shipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
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
          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Shipments Table */}
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
                          {shipment.orderIds ? (
                            <ul className="list-disc list-inside">
                              {shipment.orderIds.map((orderId) => (
                                <li key={orderId} className="text-sm">
                                  {orderId}
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
                          {shipment.status === 'In Transit' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(shipment._id, 'Delivered')}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                              >
                                Delivered
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(shipment._id, 'Delayed', 'Traffic delay')}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                              >
                                Delay
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(shipment._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}