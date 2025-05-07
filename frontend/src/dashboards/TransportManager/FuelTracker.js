import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaGasPump } from 'react-icons/fa';

export default function FuelTracker() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [summary, setSummary] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [log, setLog] = useState({ vehicleId: '', liters: '', cost: '', distance: '' });
  const [editingLog, setEditingLog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(''); // For form validation errors inside the form
  const [globalMessage, setGlobalMessage] = useState(null); // For success/error messages outside the form
  const [globalMessageType, setGlobalMessageType] = useState(""); // Type: "success", "error", "confirm"
  const [confirmAction, setConfirmAction] = useState(null); // Store the action to confirm (delete)

  useEffect(() => {
    fetchVehicles();
    fetchFuelLogs();
    fetchFuelSummary();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to fetch vehicles. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFuelLogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/fuel');
      setFuelLogs(res.data);
    } catch (error) {
      console.error('Failed to fetch fuel logs:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to fetch fuel logs. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFuelSummary = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/fuel/summary');
      setSummary(res.data);
    } catch (error) {
      console.error('Failed to fetch fuel summary:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to fetch fuel summary. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!log.vehicleId) {
      return "Vehicle ID is required.";
    }
    if (!log.liters) {
      return "Liters is required.";
    }
    if (log.liters <= 0) {
      return "Liters must be a positive number.";
    }
    if (!log.cost) {
      return "Cost is required.";
    }
    if (log.cost <= 0) {
      return "Cost must be a positive number.";
    }
    if (!log.distance) {
      return "Distance is required.";
    }
    if (log.distance <= 0) {
      return "Distance must be a positive number.";
    }
    return null;
  };

  const handleAddLog = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      await axios.post('http://localhost:5000/api/fuel', log);
      setLog({ vehicleId: '', liters: '', cost: '', distance: '' });
      fetchFuelLogs();
      fetchFuelSummary();
      setGlobalMessage("Fuel log added successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to add fuel log:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to add fuel log. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    setLog({
      vehicleId: log.vehicleId,
      liters: log.liters,
      cost: log.cost,
      distance: log.distance,
    });
  };

  const handleUpdateLog = async () => {
    if (!editingLog) return;

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsLoading(true);
    setFormError('');
    try {
      await axios.put(`http://localhost:5000/api/fuel/${editingLog._id}`, log);
      setEditingLog(null);
      setLog({ vehicleId: '', liters: '', cost: '', distance: '' });
      fetchFuelLogs();
      fetchFuelSummary();
      setGlobalMessage("Fuel log updated successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to update fuel log:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to update fuel log. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/fuel/${id}`);
      fetchFuelLogs();
      fetchFuelSummary();
      setGlobalMessage("Fuel log deleted successfully!");
      setGlobalMessageType("success");
    } catch (error) {
      console.error('Failed to delete fuel log:', error);
      setGlobalMessage(error.response?.data?.error || 'Failed to delete fuel log. Please try again.');
      setGlobalMessageType("error");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  // Function to show confirmation dialog
  const showConfirmation = (action, id) => {
    setConfirmAction({ action, id });
    setGlobalMessage("Are you sure you want to delete this fuel log?");
    setGlobalMessageType("confirm");
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (confirmAction.action === 'delete') {
      handleDeleteLog(confirmAction.id);
    }
  };

  // Function to close the global message
  const closeGlobalMessage = () => {
    setGlobalMessage(null);
    setGlobalMessageType("");
    setConfirmAction(null);
  };

  return (
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Fuel Consumption Tracker
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Track and manage fuel usage for your fleet
          </p>
        </header>

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

        {/* Add/Edit Fuel Log Form - Redesigned as a Card */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
            <FaGasPump className="mr-2 text-green-500" />
            {editingLog ? 'Edit Fuel Log' : 'Add Fuel Log'}
          </h2>
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{formError}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Vehicle ID *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={log.vehicleId}
                onChange={(e) => setLog({ ...log, vehicleId: e.target.value })}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle.vehicleId}>
                    {vehicle.vehicleId}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Liters *</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Liters"
                value={log.liters}
                onChange={(e) => setLog({ ...log, liters: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Cost *</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Cost"
                value={log.cost}
                onChange={(e) => setLog({ ...log, cost: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Distance (km) *</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Distance (km)"
                value={log.distance}
                onChange={(e) => setLog({ ...log, distance: e.target.value })}
              />
            </div>
            <div className="flex items-end space-x-2">
              {editingLog ? (
                <>
                  <button
                    onClick={handleUpdateLog}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingLog(null);
                      setLog({ vehicleId: '', liters: '', cost: '', distance: '' });
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
                  onClick={handleAddLog}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Log'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fuel Logs Table */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-green-900 mb-4">All Fuel Logs</h3>
          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : fuelLogs.length === 0 ? (
            <div className="text-center text-gray-600">No fuel logs available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-800 font-semibold">Date</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Vehicle</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Liters</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Cost</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Distance (km)</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.map((log) => (
                    <tr key={log._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                      <td className="py-3 px-4">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{log.vehicleId}</td>
                      <td className="py-3 px-4">{log.liters}</td>
                      <td className="py-3 px-4">${log.cost}</td>
                      <td className="py-3 px-4">{log.distance}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => handleEditLog(log)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => showConfirmation('delete', log._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Fuel Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-green-900 mb-4">Fuel Summary (Per Vehicle)</h3>
          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : summary.length === 0 ? (
            <div className="text-center text-gray-600">No summary data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-800 font-semibold">Vehicle</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Total Liters</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Total Cost</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Total Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((sum) => (
                    <tr key={sum._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                      <td className="py-3 px-4">{sum._id}</td>
                      <td className="py-3 px-4">{sum.totalLiters}</td>
                      <td className="py-3 px-4">${sum.totalCost}</td>
                      <td className="py-3 px-4">{sum.totalDistance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}