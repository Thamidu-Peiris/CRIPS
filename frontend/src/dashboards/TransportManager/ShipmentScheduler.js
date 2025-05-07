import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaCar, FaUser, FaList, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ShipmentScheduler() {
  const [schedules, setSchedules] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    orderIds: [],
    vehicleId: '',
    driverId: '',
    departureDate: '',
    expectedArrivalDate: '',
    location: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSchedules();
    fetchOrders();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/schedules');
      console.log('Schedules fetched:', response.data);
      setSchedules(response.data);
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setErrorMessage('Failed to fetch schedules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules/orders/ready');
      setOrders(response.data);
      console.log('Orders fetched:', response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setErrorMessage('Failed to fetch orders. Please try again.');
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
      console.log('Vehicles fetched:', response.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      setErrorMessage('Failed to fetch vehicles. Please try again.');
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules/drivers');
      setDrivers(response.data);
      console.log('Drivers fetched:', response.data);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      setErrorMessage('Failed to fetch drivers. Using simulated data.');
      setDrivers([
        { _id: 'DRV001', name: 'John Doe', status: 'Available' },
        { _id: 'DRV002', name: 'Jane Smith', status: 'Available' },
      ]);
    }
  };

  const handleAddSchedule = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log('Creating schedule with data:', newSchedule);
      const response = await axios.post('http://localhost:5000/api/schedules', newSchedule);
      console.log('Schedule created successfully:', response.data);
      setNewSchedule({
        orderIds: [],
        vehicleId: '',
        driverId: '',
        departureDate: '',
        expectedArrivalDate: '',
        location: '',
      });
      setIsModalOpen(false);
      await fetchSchedules(); // Ensure schedules are refreshed after creation
    } catch (error) {
      console.error('Failed to create schedule:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Failed to create schedule. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setNewSchedule({
      orderIds: schedule.orderIds,
      vehicleId: schedule.vehicleId,
      driverId: schedule.driverId,
      departureDate: new Date(schedule.departureDate).toISOString().split('T')[0],
      expectedArrivalDate: new Date(schedule.expectedArrivalDate).toISOString().split('T')[0],
      location: schedule.location || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const handleUpdateSchedule = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log('Updating schedule with data:', newSchedule);
      await axios.put(`http://localhost:5000/api/schedules/${editingSchedule._id}/update`, {
        status: editingSchedule.status,
        location: newSchedule.location,
        vehicleId: newSchedule.vehicleId,
        driverId: newSchedule.driverId,
        departureDate: newSchedule.departureDate,
        expectedArrivalDate: newSchedule.expectedArrivalDate,
      });
      setIsEditing(false);
      setIsModalOpen(false);
      setEditingSchedule(null);
      setNewSchedule({
        orderIds: [],
        vehicleId: '',
        driverId: '',
        departureDate: '',
        expectedArrivalDate: '',
        location: '',
      });
      await fetchSchedules();
    } catch (error) {
      console.error('Failed to update schedule:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Failed to update schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, delayReason = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log(`Updating schedule ${id} status to ${status}`);
      await axios.put(`http://localhost:5000/api/schedules/${id}/update`, { status, delayReason });
      await fetchSchedules();
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Failed to update status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log(`Deleting schedule ${id}`);
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
      await fetchSchedules();
    } catch (error) {
      console.error('Failed to delete schedule:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Failed to delete schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderSelection = (orderId) => {
    setNewSchedule((prev) => {
      const isSelected = prev.orderIds.includes(orderId);
      const updatedOrderIds = isSelected
        ? prev.orderIds.filter((id) => id !== orderId)
        : [...prev.orderIds, orderId];
      console.log('Updated selected orderIds:', updatedOrderIds);
      return { ...prev, orderIds: updatedOrderIds };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 mb-8"
        >
          <h1 className="text-4xl font-extrabold text-green-900">Shipment Scheduling</h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Schedule and manage shipments efficiently
          </p>
        </motion.header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          {/* Add/Edit Schedule Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex justify-end"
          >
            <button
              onClick={() => {
                setIsEditing(false);
                setNewSchedule({
                  orderIds: [],
                  vehicleId: '',
                  driverId: '',
                  departureDate: '',
                  expectedArrivalDate: '',
                  location: '',
                });
                setIsModalOpen(true);
                setErrorMessage('');
              }}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300 shadow-md"
            >
              <FaTruck className="mr-2" /> Add New Schedule
            </button>
          </motion.div>

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

          {/* Schedule Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Scheduled Shipments</h3>
            {isLoading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : schedules.length === 0 ? (
              <div className="text-center text-gray-600">No schedules available.</div>
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
                    {schedules.map((schedule) => (
                      <motion.tr
                        key={schedule._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                      >
                        <td className="py-3 px-4">{schedule.shipmentId}</td>
                        <td className="py-3 px-4">
                          {schedule.orders && schedule.orders.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {schedule.orders.map((order) => (
                                <li key={order._id} className="text-sm">
                                  {order.orderId} ({order.shippingInfo.city}, {order.shippingInfo.country})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'No orders'
                          )}
                        </td>
                        <td className="py-3 px-4">{schedule.vehicleId}</td>
                        <td className="py-3 px-4">{schedule.driverId}</td>
                        <td className="py-3 px-4">{new Date(schedule.departureDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Date(schedule.expectedArrivalDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{schedule.location || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              schedule.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : schedule.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : schedule.status === 'Delayed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {schedule.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all duration-200"
                          >
                            <FaEdit />
                          </button>
                          {schedule.status === 'Scheduled' && (
                            <button
                              onClick={() => handleStatusUpdate(schedule._id, 'In Progress')}
                              className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                            >
                              Start
                            </button>
                          )}
                          {schedule.status === 'In Progress' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(schedule._id, 'Delayed', 'Traffic delay')}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                              >
                                Delay
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteSchedule(schedule._id)}
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

          {/* Modal for Adding/Editing Schedule */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl"
              >
                <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
                  <FaTruck className="mr-2 text-green-500" />
                  {isEditing ? 'Edit Schedule' : 'Add New Schedule'}
                </h2>
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{errorMessage}</div>
                )}
                <div className="space-y-4">
                  {/* Order Selection */}
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Select Orders *</label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {orders.length === 0 ? (
                        <p className="text-gray-600">No orders available to schedule.</p>
                      ) : (
                        orders.map((order) => (
                          <div key={order._id} className="flex items-center space-x-2 py-1">
                            <input
                              type="checkbox"
                              checked={newSchedule.orderIds.includes(order._id)}
                              onChange={() => toggleOrderSelection(order._id)}
                              className="w-4 h-4 text-green-500 focus:ring-green-500"
                              disabled={isEditing}
                            />
                            <span className="text-gray-800">
                              {order.orderId} ({order.shippingInfo.city}, {order.shippingInfo.country})
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Vehicle Selection */}
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Vehicle *</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newSchedule.vehicleId}
                      onChange={(e) => setNewSchedule({ ...newSchedule, vehicleId: e.target.value })}
                      required
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle._id} value={vehicle.vehicleId}>
                          {vehicle.vehicleId} ({vehicle.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Driver Selection */}
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Driver *</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newSchedule.driverId}
                      onChange={(e) => setNewSchedule({ ...newSchedule, driverId: e.target.value })}
                      required
                    >
                      <option value="">Select Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.name} ({driver.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Departure Date */}
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Departure Date *</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={newSchedule.departureDate}
                        onChange={(e) => setNewSchedule({ ...newSchedule, departureDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Expected Arrival Date */}
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Expected Arrival Date *</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={newSchedule.expectedArrivalDate}
                        onChange={(e) => setNewSchedule({ ...newSchedule, expectedArrivalDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Initial Location */}
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Initial Location *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Colombo"
                        value={newSchedule.location}
                        onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-6">
                  <button
                    onClick={isEditing ? handleUpdateSchedule : handleAddSchedule}
                    disabled={isLoading}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : isEditing ? 'Update Schedule' : 'Create Schedule'}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setErrorMessage('');
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