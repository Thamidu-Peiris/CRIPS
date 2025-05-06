import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaCar } from 'react-icons/fa';

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
  const fileInputRef = useRef(null);

  // Base URL for the backend
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    setIsLoading(true);
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
      fetchVehicles();
    } catch (error) {
      console.error('Failed to add vehicle:', error);
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
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;
    setIsLoading(true);
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
      fetchVehicles();
    } catch (error) {
      console.error('Failed to update vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      fetchVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Vehicle Management
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Manage your fleet for aqua plant transport
          </p>
        </header>

        {/* Add/Edit Vehicle Form */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
            <FaCar className="mr-2 text-green-500" />
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
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
              <label className="block text-gray-600 font-semibold mr-2">Temperature Control *</label>
              <input
                type="checkbox"
                checked={newVehicle.temperatureControl}
                onChange={(e) => setNewVehicle({ ...newVehicle, temperatureControl: e.target.checked })}
                className="w-4 h-4 text-green-500 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center">
              <label className="block text-gray-600 font-semibold mr-2">Humidity Control *</label>
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
              <label className="block text-gray-600 font-semibold mb-1">Vehicle Picture *</label>
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
                  required={!editingVehicle || newVehicle.picture}
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
        </div>

        {/* Vehicles Grid (Box Layout) */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-green-900 mb-4">All Vehicles</h3>
          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center text-gray-600">No vehicles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
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
                        onClick={() => handleDeleteVehicle(vehicle._id)}
                        className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}