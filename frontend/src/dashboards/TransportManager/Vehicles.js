import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaCar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Base URL for the backend
const BASE_URL = 'http://localhost:5000';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    vehicleId: '',
    type: '',
    capacity: '',
    temperatureControl: false,
    humidityControl: false,
    status: 'Active',
    lastMaintenance: '',
    registrationNumber: '',
    picture: null,
  });
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formError, setFormError] = useState(''); // For form validation errors inside the form
  const [messages, setMessages] = useState([]); // Queue for success/error messages
  const [confirmAction, setConfirmAction] = useState(null); // Store the action to confirm (delete)
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchVehicles();
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

  const fetchVehicles = async () => {
    setIsLoading(true);
    setFormError('');
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      addMessage(error.response?.data?.error || 'Failed to fetch vehicles. Please try again.', "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

    if (!newVehicle.vehicleId.trim()) {
      return "Vehicle ID is required.";
    }
    if (!newVehicle.type) {
      return "Vehicle Type is required.";
    }
    if (!newVehicle.capacity) {
      return "Capacity is required.";
    }
    if (newVehicle.capacity <= 0) {
      return "Capacity must be a positive number.";
    }
    if (!newVehicle.registrationNumber.trim()) {
      return "Registration Number is required.";
    }
    if (!editingVehicle && !newVehicle.picture) {
      return "Vehicle Picture is required.";
    }
    if (newVehicle.picture && newVehicle.picture.size > maxFileSize) {
      return "Vehicle Picture must be less than 5MB.";
    }
    return null;
  };

  const handleAddVehicle = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('vehicleId', newVehicle.vehicleId);
      formData.append('type', newVehicle.type);
      formData.append('capacity', newVehicle.capacity);
      formData.append('temperatureControl', newVehicle.temperatureControl);
      formData.append('humidityControl', newVehicle.humidityControl);
      formData.append('status', newVehicle.status);
      formData.append('lastMaintenance', newVehicle.lastMaintenance);
      formData.append('registrationNumber', newVehicle.registrationNumber);
      if (newVehicle.picture) {
        formData.append('picture', newVehicle.picture);
      }

      await axios.post('http://localhost:5000/api/vehicles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewVehicle({
        vehicleId: '',
        type: '',
        capacity: '',
        temperatureControl: false,
        humidityControl: false,
        status: 'Active',
        lastMaintenance: '',
        registrationNumber: '',
        picture: null,
      });
      setPreviewImage(null);
      addMessage("Vehicle added successfully!", "success");
      fetchVehicles();
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      addMessage(error.response?.data?.error || 'Failed to add vehicle. Please try again.', "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      vehicleId: vehicle.vehicleId,
      type: vehicle.type,
      capacity: vehicle.capacity,
      temperatureControl: vehicle.temperatureControl,
      humidityControl: vehicle.humidityControl,
      status: vehicle.status,
      lastMaintenance: vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance).toISOString().split('T')[0] : '',
      registrationNumber: vehicle.registrationNumber,
      picture: null,
    });
    setPreviewImage(`${BASE_URL}${vehicle.picture}`); // Use full URL for preview
    setFormError('');
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('vehicleId', newVehicle.vehicleId);
      formData.append('type', newVehicle.type);
      formData.append('capacity', newVehicle.capacity);
      formData.append('temperatureControl', newVehicle.temperatureControl);
      formData.append('humidityControl', newVehicle.humidityControl);
      formData.append('status', newVehicle.status);
      formData.append('lastMaintenance', newVehicle.lastMaintenance);
      formData.append('registrationNumber', newVehicle.registrationNumber);
      if (newVehicle.picture) {
        formData.append('picture', newVehicle.picture);
      }

      await axios.put(`http://localhost:5000/api/vehicles/${editingVehicle._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditingVehicle(null);
      setNewVehicle({
        vehicleId: '',
        type: '',
        capacity: '',
        temperatureControl: false,
        humidityControl: false,
        status: 'Active',
        lastMaintenance: '',
        registrationNumber: '',
        picture: null,
      });
      setPreviewImage(null);
      addMessage("Vehicle updated successfully!", "success");
      fetchVehicles();
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      addMessage(error.response?.data?.error || 'Failed to update vehicle. Please try again.', "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      addMessage("Vehicle deleted successfully!", "success");
      fetchVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      addMessage(error.response?.data?.error || 'Failed to delete vehicle. Please try again.', "error");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  // Function to show confirmation dialog
  const showConfirmation = (id) => {
    setConfirmAction({ action: 'delete', id });
    setMessages((prev) => [...prev, { message: "Are you sure you want to delete this vehicle?", type: "confirm", id: Date.now() }]);
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (confirmAction.action === 'delete') {
      handleDeleteVehicle(confirmAction.id);
    }
  };

  // Function to close a specific message
  const closeMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (confirmAction) {
      setConfirmAction(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewVehicle({ ...newVehicle, picture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setNewVehicle({ ...newVehicle, picture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
                    : "bg-gray-100 border border-gray-300 text-gray-800"
                } ${msg.type === "confirm" ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" : ""}`}
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
            Vehicle Management
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Manage your fleet for aqua plant transport
          </p>
        </motion.header>

        {/* Add/Edit Vehicle Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
            <FaCar className="mr-2 text-green-500" />
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{formError}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Vehicle ID *</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Vehicle ID (e.g., V001)"
                value={newVehicle.vehicleId}
                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleId: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Type *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="Refrigerated Van">Refrigerated Van</option>
                <option value="Flatbed Truck">Flatbed Truck</option>
                <option value="Box Truck">Box Truck</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Capacity (m³) *</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Capacity in cubic meters"
                value={newVehicle.capacity}
                onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center">
              <label className="block text-gray-600 font-semibold mr-2">Temperature Control</label>
              <input
                type="checkbox"
                checked={newVehicle.temperatureControl}
                onChange={(e) => setNewVehicle({ ...newVehicle, temperatureControl: e.target.checked })}
                className="w-4 h-4 text-green-500 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center">
              <label className="block text-gray-600 font-semibold mr-2">Humidity Control</label>
              <input
                type="checkbox"
                checked={newVehicle.humidityControl}
                onChange={(e) => setNewVehicle({ ...newVehicle, humidityControl: e.target.checked })}
                className="w-4 h-4 text-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Status *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newVehicle.status}
                onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                required
              >
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Last Maintenance</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="date"
                value={newVehicle.lastMaintenance}
                onChange={(e) => setNewVehicle({ ...newVehicle, lastMaintenance: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Registration Number *</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Registration Number"
                value={newVehicle.registrationNumber}
                onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Vehicle Picture {editingVehicle ? '' : '*'}
              </label>
              <div
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-500 transition-colors duration-300"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-lg" />
                ) : (
                  <p className="text-gray-500">Drag & drop or click to select an image</p>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              {editingVehicle ? (
                <>
                  <button
                    onClick={handleUpdateVehicle}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingVehicle(null);
                      setNewVehicle({
                        vehicleId: '',
                        type: '',
                        capacity: '',
                        temperatureControl: false,
                        humidityControl: false,
                        status: 'Active',
                        lastMaintenance: '',
                        registrationNumber: '',
                        picture: null,
                      });
                      setPreviewImage(null);
                      setFormError('');
                    }}
                    disabled={isLoading}
                    className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddVehicle}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Vehicle'}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Vehicles Grid (Box Layout) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <h3 className="text-2xl font-semibold text-green-900 mb-4">All Vehicles</h3>
          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center text-gray-600">No vehicles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={`${BASE_URL}${vehicle.picture}`}
                    alt={vehicle.vehicleId}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found')} // Fallback image
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-green-900 mb-2">{vehicle.vehicleId}</h4>
                    <div className="space-y-1 text-gray-600">
                      <p><span className="font-medium">Type:</span> {vehicle.type}</p>
                      <p><span className="font-medium">Capacity:</span> {vehicle.capacity} m³</p>
                      <p><span className="font-medium">Temp Control:</span> {vehicle.temperatureControl ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Humidity Control:</span> {vehicle.humidityControl ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Status:</span> {vehicle.status}</p>
                      <p><span className="font-medium">Last Maintenance:</span> {vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance).toLocaleDateString() : 'N/A'}</p>
                      <p><span className="font-medium">Reg. Number:</span> {vehicle.registrationNumber}</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        className="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => showConfirmation(vehicle._id)}
                        className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}