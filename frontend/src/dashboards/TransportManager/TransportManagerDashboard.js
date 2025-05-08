import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { 
  FaTruck, FaGasPump, FaChartBar, FaClipboardCheck, FaCar, FaUsers
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransportManagerDashboard() {
  const [stats, setStats] = useState({
    activeShipments: 0,
    activeVehicles: 0,
    activeDrivers: 0,
  });
  const [recentFuelLogs, setRecentFuelLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [messages, setMessages] = useState([]); // Queue for success/error messages
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardStats();
    fetchRecentFuelLogs();
    fetchVehicles();
    fetchDrivers();
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

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transport/dashboard-stats');
      console.log('Dashboard stats response:', response.data); // Log the response to verify
      const data = response.data || {};
      setStats({
        activeShipments: data.activeShipments || 0,
        activeVehicles: data.activeVehicles || 0,
        activeDrivers: data.activeDrivers || 0,
      });
    } catch (error) {
      console.error('Failed to fetch transport stats:', error);
      addMessage(error.response?.data?.error || 'Failed to fetch dashboard stats. Please try again.', "error");
      setStats({
        activeShipments: 0,
        activeVehicles: 0,
        activeDrivers: 0,
      });
    }
  };

  const fetchRecentFuelLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fuel');
      setRecentFuelLogs(response.data.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to fetch recent fuel logs:', error);
      addMessage(error.response?.data?.error || 'Failed to fetch recent fuel logs. Please try again.', "error");
      setRecentFuelLogs([]);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      addMessage(error.response?.data?.error || 'Failed to fetch vehicles. Please try again.', "error");
      setVehicles([]);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      addMessage(error.response?.data?.error || 'Failed to fetch drivers. Please try again.', "error");
      setDrivers([]);
    }
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  // Close a specific message
  const closeMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6 relative">
        {/* Global Message Display (Success/Error) */}
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
                    : "bg-red-100 border border-red-300 text-red-800"
                }`}
              >
                <span className="font-medium">{msg.message}</span>
                <button
                  onClick={() => closeMessage(msg.id)}
                  className="ml-4 text-xl font-bold hover:text-gray-600 focus:outline-none"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* White Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <h1 className="text-4xl font-extrabold text-green-900">Transport Manager Dashboard</h1>
          <p className="text-xl mt-2 font-light text-gray-600">Welcome, Transport Manager!</p>
        </motion.header>

        {/* Key Metrics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Active Shipments */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaTruck className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Active Shipments</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.activeShipments}</p>
            <p className="text-sm text-gray-600 mt-1">In transit right now</p>
          </motion.div>

          {/* Active Vehicles */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaCar className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Active Vehicles</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.activeVehicles}</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.activeVehicles === 0 ? 'No vehicles currently operational' : 'Currently operational'}
            </p>
          </motion.div>

          {/* Active Drivers */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaUsers className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Active Drivers</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.activeDrivers}</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.activeDrivers === 0 ? 'No drivers currently on duty' : 'On duty now'}
            </p>
          </motion.div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50"
        >
          <h2 className="text-xl font-semibold text-green-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/shipment-scheduler")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaTruck className="mr-2" /> Schedule Shipment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/fuel-tracker")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaGasPump className="mr-2" /> Log Fuel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/quality-check-log")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaClipboardCheck className="mr-2" /> Quality Check
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/vehicles")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaCar className="mr-2" /> Manage Vehicles
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/drivers")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaUsers className="mr-2" /> Manage Drivers
            </motion.button>
          </div>
        </motion.div>

        {/* Vehicle and Driver Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Vehicle Status */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaCar className="mr-2 text-green-600" /> Vehicle Status
            </h2>
            {vehicles.length === 0 ? (
              <p className="text-gray-600">No vehicles available.</p>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {vehicles.map((vehicle) => (
                  <motion.li
                    key={vehicle._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={`http://localhost:5000${vehicle.picture}`}
                        alt={vehicle.vehicleId}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=Image+Not+Found')}
                      />
                      <div>
                        <span className="font-medium text-gray-800">{vehicle.vehicleId}</span>
                        <p className="text-sm text-gray-500">{vehicle.type}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        vehicle.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : vehicle.status === "Under Maintenance"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Driver Management */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaUsers className="mr-2 text-green-600" /> Driver Management
            </h2>
            {drivers.length === 0 ? (
              <p className="text-gray-600">No drivers available.</p>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {drivers.map((driver) => (
                  <motion.li
                    key={driver._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={`http://localhost:5000${driver.profilePicture}`}
                        alt={driver.name}
                        className="w-12 h-12 object-cover rounded-full"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=Driver')}
                      />
                      <div>
                        <span className="font-medium text-gray-800">{driver.name}</span>
                        <p className="text-sm text-gray-500">{driver.status}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickAction(`/drivers`)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      View Profile
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Fuel Logs */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaGasPump className="mr-2 text-green-600" /> Recent Fuel Logs
            </h2>
            {recentFuelLogs.length === 0 ? (
              <p className="text-gray-600">No recent fuel logs available.</p>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {recentFuelLogs.map((log) => (
                  <motion.li
                    key={log._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 py-2 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-gray-800">{log.vehicleId}</span>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{log.liters} liters</p>
                      <p className="text-sm text-gray-600">${log.cost}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}