import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaCar, FaUser, FaList, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [formError, setFormError] = useState(''); // For form validation errors inside modal
  const [globalMessage, setGlobalMessage] = useState(null); // For success/error messages outside modal
  const [globalMessageType, setGlobalMessageType] = useState(""); // Type: "success", "error", "confirm"
  const [confirmAction, setConfirmAction] = useState(null); // Store the action to confirm (status update/delete)

  useEffect(() => {
    fetchSchedules();
    fetchOrders();
    fetchVehicles();
    fetchDrivers();
  }, []);

  // Re-fetch drivers and vehicles whenever departureDate changes
  useEffect(() => {
    if (isModalOpen && newSchedule.departureDate) {
      fetchVehicles();
      fetchDrivers();
    }
  }, [newSchedule.departureDate, isModalOpen]);

  // Automatically clear global message after 3 seconds if it's a success or error
  useEffect(() => {
    if (globalMessage && (globalMessageType === "success" || globalMessageType === "error")) {
      const timer = setTimeout(() => {
        setGlobalMessage(null);
        setGlobalMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [globalMessage, globalMessageType]);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error.response?.data || error.message);
      setGlobalMessage(error.response?.data?.error || 'Failed to fetch schedules. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules/orders/ready');
      const confirmedOrders = response.data.filter(order => order.status.toLowerCase() === 'confirmed');
      setOrders(confirmedOrders);
      setNewSchedule((prev) => ({
        ...prev,
        orderIds: [],
      }));
    } catch (error) {
      console.error('Failed to fetch orders:', error.response?.data || error.message);
      setGlobalMessage(error.response?.data?.error || 'Failed to fetch orders. Please try again.');
      setGlobalMessageType("error");
    }
  };

  const fetchVehicles = async () => {
    try {
      const params = newSchedule.departureDate ? { departureDate: newSchedule.departureDate } : {};
      const response = await axios.get('http://localhost:5000/api/schedules/vehicles/available', { params });
      setVehicles(response.data);
      if (!response.data || response.data.length === 0) {
        setFormError('No available vehicles found for the selected departure date.');
      } else {
        setFormError('');
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      setFormError(error.response?.data?.error || 'Failed to fetch vehicles. Please try again.');
    }
  };

  const fetchDrivers = async () => {
    try {
      const params = newSchedule.departureDate ? { departureDate: newSchedule.departureDate } : {};
      const response = await axios.get('http://localhost:5000/api/schedules/drivers-available', { params });
      setDrivers(response.data);
      if (!response.data || response.data.length === 0) {
        setFormError('No available drivers found for the selected departure date.');
      } else if (vehicles.length > 0) {
        setFormError('');
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      setFormError(error.response?.data?.error || 'Failed to fetch drivers. Please try again.');
    }
  };

  const validateForm = () => {
    const currentDate = new Date('2025-05-07'); // Current date as of May 07, 2025
    const departureDate = new Date(newSchedule.departureDate);
    const arrivalDate = new Date(newSchedule.expectedArrivalDate);

    if (newSchedule.orderIds.length === 0) {
      return "At least one order must be selected.";
    }
    if (!newSchedule.vehicleId) {
      return "Vehicle is required.";
    }
    if (!newSchedule.driverId) {
      return "Driver is required.";
    }
    if (!newSchedule.departureDate) {
      return "Departure date is required.";
    }
    if (departureDate < currentDate) {
      return "Departure date cannot be in the past.";
    }
    if (!newSchedule.expectedArrivalDate) {
      return "Expected arrival date is required.";
    }
    if (arrivalDate <= departureDate) {
      return "Expected arrival date must be after departure date.";
    }
    if (!newSchedule.location.trim()) {
      return "Initial location is required.";
    }
    return null;
  };

  const handleAddSchedule = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      const validOrderIds = newSchedule.orderIds.filter(id => {
        const order = orders.find(order => order._id === id);
        return order && order.status.toLowerCase() === 'confirmed';
      });
      if (validOrderIds.length !== newSchedule.orderIds.length) {
        const invalidOrderIds = newSchedule.orderIds.filter(id => !validOrderIds.includes(id));
        throw new Error(`The following order IDs are invalid or no longer confirmed: ${invalidOrderIds.join(', ')}`);
      }

      const response = await axios.post('http://localhost:5000/api/schedules', { ...newSchedule, orderIds: validOrderIds });
      setNewSchedule({
        orderIds: [],
        vehicleId: '',
        driverId: '',
        departureDate: '',
        expectedArrivalDate: '',
        location: '',
      });
      setIsModalOpen(false);
      await fetchSchedules();
      await fetchOrders();
      await fetchVehicles();
      await fetchDrivers();
      setGlobalMessage("Schedule created successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to create schedule:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create schedule.';
      const errorDetails = error.response?.data?.details || '';
      setFormError(`${errorMsg} ${errorDetails}`);
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
    setFormError('');
  };

  const handleUpdateSchedule = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
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
      await fetchVehicles();
      await fetchDrivers();
      setGlobalMessage("Schedule updated successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to update schedule:', error.response?.data || error.message);
      setFormError(error.response?.data?.error || 'Failed to update schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, delayReason = '') => {
    try {
      await axios.put(`http://localhost:5000/api/schedules/${id}/update`, { status, delayReason });
      if (status === 'In Progress') {
        await axios.post(`http://localhost:5000/api/shipments/scheduler/${id}/complete`);
      }
      await fetchSchedules();
      await fetchOrders();
      await fetchVehicles();
      await fetchDrivers();
      setGlobalMessage("Schedule status updated successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
      setGlobalMessage(error.response?.data?.error || 'Failed to update status. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`);
      await fetchSchedules();
      await fetchOrders();
      await fetchVehicles();
      await fetchDrivers();
      setGlobalMessage("Schedule deleted successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to delete schedule:', error.response?.data || error.message);
      setGlobalMessage(error.response?.data?.error || 'Failed to delete schedule. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  // Function to show confirmation dialog
  const showConfirmation = (action, id, status = '', delayReason = '') => {
    setConfirmAction({ action, id, status, delayReason });
    setGlobalMessage(
      action === 'delete'
        ? "Are you sure you want to delete this schedule?"
        : `Are you sure you want to ${status === 'In Progress' ? 'start' : 'delay'} this schedule?`
    );
    setGlobalMessageType("confirm");
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (confirmAction.action === 'delete') {
      handleDeleteSchedule(confirmAction.id);
    } else if (confirmAction.action === 'statusUpdate') {
      handleStatusUpdate(confirmAction.id, confirmAction.status, confirmAction.delayReason);
    }
  };

  // Function to close the global message
  const closeGlobalMessage = () => {
    setGlobalMessage(null);
    setGlobalMessageType("");
    setConfirmAction(null);
  };

  const toggleOrderSelection = (orderId) => {
    setNewSchedule((prev) => {
      const isSelected = prev.orderIds.includes(orderId);
      const updatedOrderIds = isSelected
        ? prev.orderIds.filter((id) => id !== orderId)
        : [...prev.orderIds, orderId];
      return { ...prev, orderIds: updatedOrderIds };
    });
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
          <h1 className="text-4xl font-extrabold text-green-900">Shipment Scheduling</h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Schedule and manage shipments efficiently
          </p>
        </motion.header>

        {/* Global Message Display (Success/Error/Confirmation) */}
        <AnimatePresence>
          {globalMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl shadow-lg flex items-center justify-between max-w-md w-full ${
                globalMessageType === "success"
                  ? "bg-green-100 border border-green-300 text-green-800"
                  : globalMessageType === "error"
                  ? "bg-red-100 border border-red-300 text-red-800"
                  : "bg-gray-100 border border-gray-300 text-gray-800"
              }`}
            >
              <span className="font-medium">{globalMessage}</span>
              <div className="flex space-x-2">
                {globalMessageType === "confirm" && (
                  <>
                    <button
                      onClick={handleConfirm}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                    >
                      Yes
                    </button>
                    <button
                      onClick={closeGlobalMessage}
                      className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition-all duration-200"
                    >
                      No
                    </button>
                  </>
                )}
                <button
                  onClick={closeGlobalMessage}
                  className="ml-4 text-xl font-bold hover:text-gray-600 focus:outline-none"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
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
                setFormError('');
              }}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300 shadow-md"
            >
              <FaTruck className="mr-2" /> Add New Schedule
            </button>
          </motion.div>

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
                                  {order._id} ({order.shippingInfo.city}, {order.shippingInfo.country})
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
                              onClick={() => showConfirmation('statusUpdate', schedule._id, 'In Progress')}
                              className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                            >
                              Start
                            </button>
                          )}
                          {schedule.status === 'In Progress' && (
                            <button
                              onClick={() => showConfirmation('statusUpdate', schedule._id, 'Delayed', 'Traffic delay')}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                            >
                              Delay
                            </button>
                          )}
                          <button
                            onClick={() => showConfirmation('delete', schedule._id)}
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
                {formError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{formError}</div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Select Confirmed Orders *</label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {orders.length === 0 ? (
                        <p className="text-gray-600">No confirmed orders available to schedule.</p>
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
                              {order._id} ({order.shippingInfo.city}, {order.shippingInfo.country}) - Total: ${order.total}
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                {order.status}
                              </span>
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

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

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Vehicle *</label>
                    {vehicles.length === 0 ? (
                      <p className="text-gray-600">No available vehicles for the selected departure date.</p>
                    ) : (
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
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Driver *</label>
                    {drivers.length === 0 ? (
                      <p className="text-gray-600">No available drivers for the selected departure date.</p>
                    ) : (
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={newSchedule.driverId}
                        onChange={(e) => setNewSchedule({ ...newSchedule, driverId: e.target.value })}
                        required
                      >
                        <option value="">Select Driver</option>
                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver.driverId}>
                            {driver.driverId} - {driver.name} ({driver.status})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

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