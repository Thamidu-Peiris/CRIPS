import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaUser, FaEdit, FaTrash, FaPlus, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function DriversUI() {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(''); // For form validation errors inside modal
  const [globalMessage, setGlobalMessage] = useState(null); // For success/error messages outside modal
  const [globalMessageType, setGlobalMessageType] = useState(""); // Type: "success", "error", "confirm"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    licenseNumber: '',
    status: 'Available',
    profilePicture: null,
  });
  const [confirmAction, setConfirmAction] = useState(null); // Store the action to confirm (delete/toggle)

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Failed to fetch drivers:', error.response?.data || error.message);
      setGlobalMessage(error.response?.data?.error || 'Failed to fetch drivers. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}(-\d{1,5})?$/; // e.g., 1234567890 or 1234567890-12345
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!newDriver.name.trim()) {
      return "Name is required.";
    }
    if (!newDriver.email) {
      return "Email is required.";
    }
    if (!emailRegex.test(newDriver.email)) {
      return "Please enter a valid email address.";
    }
    if (!newDriver.phoneNumber) {
      return "Phone number is required.";
    }
    if (!phoneRegex.test(newDriver.phoneNumber)) {
      return "Please enter a valid phone number (e.g., 1234567890 or 1234567890-12345).";
    }
    if (!newDriver.licenseNumber.trim()) {
      return "License number is required.";
    }
    if (newDriver.profilePicture && newDriver.profilePicture.size > maxFileSize) {
      return "Profile picture must be less than 5MB.";
    }
    return null;
  };

  const handleAddDriver = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('name', newDriver.name);
      formData.append('email', newDriver.email);
      formData.append('phoneNumber', newDriver.phoneNumber);
      formData.append('licenseNumber', newDriver.licenseNumber);
      formData.append('status', newDriver.status);
      if (newDriver.profilePicture) {
        formData.append('profilePicture', newDriver.profilePicture);
      }

      const response = await axios.post('http://localhost:5000/api/drivers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Driver created:', response.data);
      setNewDriver({
        name: '',
        email: '',
        phoneNumber: '',
        licenseNumber: '',
        status: 'Available',
        profilePicture: null,
      });
      setIsModalOpen(false);
      await fetchDrivers();
      setGlobalMessage("Driver added successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to create driver:', error.response?.data || error.message);
      setFormError(error.response?.data?.error || 'Failed to create driver. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setNewDriver({
      name: driver.name,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      licenseNumber: driver.licenseNumber,
      status: driver.status,
      profilePicture: null,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleUpdateDriver = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('name', newDriver.name);
      formData.append('email', newDriver.email);
      formData.append('phoneNumber', newDriver.phoneNumber);
      formData.append('licenseNumber', newDriver.licenseNumber);
      formData.append('status', newDriver.status);
      if (newDriver.profilePicture) {
        formData.append('profilePicture', newDriver.profilePicture);
      }

      const response = await axios.put(`http://localhost:5000/api/drivers/${selectedDriver._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Driver updated:', response.data);
      setNewDriver({
        name: '',
        email: '',
        phoneNumber: '',
        licenseNumber: '',
        status: 'Available',
        profilePicture: null,
      });
      setIsEditing(false);
      setIsModalOpen(false);
      setSelectedDriver(null);
      await fetchDrivers();
      setGlobalMessage("Driver updated successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to update driver:', error.response?.data || error.message);
      setFormError(error.response?.data?.error || 'Failed to update driver. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      await fetchDrivers();
      setGlobalMessage("Driver deleted successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to delete driver:', error.response?.data || error.message);
      setGlobalMessage(error.response?.data?.error || 'Failed to delete driver. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  const handleStatusToggle = async (driver) => {
    try {
      const newStatus = driver.status === 'Available' ? 'Inactive' : 'Available';
      await axios.put(`http://localhost:5000/api/drivers/${driver._id}`, {
        name: driver.name,
        email: driver.email,
        phoneNumber: driver.phoneNumber,
        licenseNumber: driver.licenseNumber,
        status: newStatus,
      });
      await fetchDrivers();
      setGlobalMessage("Driver status updated successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to toggle driver status:', error.response?.data || error.message);
      setGlobalMessage(error.response?.data?.error || 'Failed to toggle driver status. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  // Function to show confirmation dialog
  const showConfirmation = (action, driver) => {
    setConfirmAction({ action, driver });
    setGlobalMessage(
      action === 'delete'
        ? "Are you sure you want to delete this driver?"
        : `Are you sure you want to ${driver.status === 'Available' ? 'deactivate' : 'activate'} this driver?`
    );
    setGlobalMessageType("confirm");
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (confirmAction.action === 'delete') {
      handleDeleteDriver(confirmAction.driver._id);
    } else if (confirmAction.action === 'toggle') {
      handleStatusToggle(confirmAction.driver);
    }
  };

  // Function to close the global message
  const closeGlobalMessage = () => {
    setGlobalMessage(null);
    setGlobalMessageType("");
    setConfirmAction(null);
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
          <h1 className="text-4xl font-extrabold text-green-900">Driver Management</h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Manage your drivers efficiently
          </p>
        </motion.header>

        {/* Global Message Display (Success/Error/Confirmation) */}
        {globalMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`p-4 rounded-xl shadow-lg flex items-center justify-between max-w-md w-full transition-all duration-300 ${
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
            </div>
          </div>
        )}

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
                setNewDriver({
                  name: '',
                  email: '',
                  phoneNumber: '',
                  licenseNumber: '',
                  status: 'Available',
                  profilePicture: null,
                });
                setIsModalOpen(true);
                setFormError('');
              }}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300 shadow-md"
            >
              <FaPlus className="mr-2" /> Add New Driver
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
              <FaUser className="mr-2 text-green-500" />
              Drivers
            </h3>
            {isLoading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : drivers.length === 0 ? (
              <div className="text-center text-gray-600">No drivers available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                  <motion.div
                    key={driver._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center"
                  >
                    <div className="relative mb-4">
                      {driver.profilePicture ? (
                        <img
                          src={`http://localhost:5000${driver.profilePicture}`}
                          alt={driver.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-green-500 shadow-md">
                          <FaUser className="text-gray-500 text-3xl" />
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md ${
                          driver.status === 'Available'
                            ? 'bg-green-500'
                            : driver.status === 'On Duty'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {driver.status === 'Available' ? (
                          <FaCheckCircle className="text-white" />
                        ) : (
                          <FaTimesCircle className="text-white" />
                        )}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-green-900 mb-2">{driver.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Driver ID:</span> {driver.driverId}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Email:</span> {driver.email}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Phone:</span> {driver.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">License:</span> {driver.licenseNumber}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Status:</span>{' '}
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          driver.status === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : driver.status === 'On Duty'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {driver.status}
                      </span>
                    </p>
                    <div className="w-full mb-3">
                      <p className="text-sm text-gray-600 font-medium">Assigned Shipments:</p>
                      {driver.assignedShipments && driver.assignedShipments.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {driver.assignedShipments.map((shipment) => (
                            <li key={shipment._id}>
                              {shipment.shipmentId} ({shipment.status})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No shipments</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDriver(driver)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => showConfirmation('toggle', driver)}
                        className={`px-3 py-1 rounded-lg text-white transition-all duration-200 flex items-center ${
                          driver.status === 'Available'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {driver.status === 'Available' ? (
                          <>
                            <FaTimesCircle className="mr-1" /> Deactivate
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="mr-1" /> Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => showConfirmation('delete', driver)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg"
              >
                <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
                  <FaUser className="mr-2 text-green-500" />
                  {isEditing ? 'Edit Driver' : 'Add New Driver'}
                </h2>
                {formError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{formError}</div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Name *</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newDriver.name}
                      onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Email *</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newDriver.phoneNumber}
                      onChange={(e) => setNewDriver({ ...newDriver, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">License Number *</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newDriver.licenseNumber}
                      onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Status *</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newDriver.status}
                      onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="On Duty">On Duty</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={(e) => setNewDriver({ ...newDriver, profilePicture: e.target.files[0] })}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 mt-6">
                  <button
                    onClick={isEditing ? handleUpdateDriver : handleAddDriver}
                    disabled={isLoading}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : isEditing ? 'Update Driver' : 'Add Driver'}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormError('');
                      setSelectedDriver(null);
                      setIsEditing(false);
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