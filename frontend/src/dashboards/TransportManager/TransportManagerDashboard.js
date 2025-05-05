import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaGasPump, FaClipboardCheck, FaBell, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

export default function TransportManagerDashboard() {
  const [stats, setStats] = useState({
    activeShipments: 0,
    fuelEfficiency: 0,
    onTimeDelivery: 0
  });
  const [recentShipments, setRecentShipments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentShipments();
    fetchSystemAlerts();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transport/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch transport stats:', error);
    }
  };

  const fetchRecentShipments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shipments/recent');
      setRecentShipments(response.data || []);
    } catch (error) {
      console.error('Failed to fetch recent shipments:', error);
      // Fallback to mock data if API fails
      setRecentShipments([
        { _id: "SHP001", shipmentId: "SHP001", status: "Delivered", departureDate: "2025-04-01" },
        { _id: "SHP002", shipmentId: "SHP002", status: "In Transit", departureDate: "2025-04-02" },
        { _id: "SHP003", shipmentId: "SHP003", status: "Pending", departureDate: "2025-04-03" },
      ]);
    }
  };

  const fetchSystemAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transport/alerts');
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch system alerts:', error);
      // Fallback to mock data if API fails
      setAlerts([
        { id: 1, message: "Shipment SHP001 delayed by 2 hours", type: "warning" },
        { id: 2, message: "Fuel efficiency dropped below 20 mpg", type: "error" },
      ]);
    }
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h1 className="text-4xl font-extrabold text-green-900">
            Transport Manager Dashboard
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Welcome, Transport Manager!
          </p>
        </header>

        {/* ✅ Dynamic Dashboard Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-200">
            <h3 className="text-xl font-semibold text-green-900">Active Shipments</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.activeShipments}</p>
            <p className="text-sm text-gray-600 mt-1">In transit right now</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-200">
            <h3 className="text-xl font-semibold text-green-900">Fuel Efficiency</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.fuelEfficiency} <span className="text-sm">mpg</span></p>
            <p className="text-sm text-gray-600 mt-1">Fleet average this week</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-200">
            <h3 className="text-xl font-semibold text-green-900">On-Time Delivery</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.onTimeDelivery}%</p>
            <p className="text-sm text-gray-600 mt-1">This month’s performance</p>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleQuickAction("/shipment-scheduler")}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaTruck className="mr-2" /> Schedule Shipment
            </button>
            <button
              onClick={() => handleQuickAction("/fuel-tracker")}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaGasPump className="mr-2" /> Log Fuel Consumption
            </button>
            <button
              onClick={() => handleQuickAction("/quality-check-log")}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaClipboardCheck className="mr-2" /> Log Quality Check
            </button>
          </div>
        </div>

        {/* System Alerts Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-green-900 mb-4">System Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-600">No alerts at this time.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className={`text-gray-600 flex items-center ${
                    alert.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}
                >
                  <FaBell className="mr-2" />
                  {alert.message}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Shipments Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Recent Shipments</h2>
          {recentShipments.length === 0 ? (
            <p className="text-gray-600">No recent shipments available.</p>
          ) : (
            <ul className="space-y-4">
              {recentShipments.map((shipment) => (
                <li
                  key={shipment._id}
                  className="border-b border-gray-200 py-2 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium text-gray-800">{shipment.shipmentId}</span>
                    <p className="text-sm text-gray-500">
                      Departure: {new Date(shipment.departureDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      shipment.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : shipment.status === "In Transit"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    } flex items-center`}
                  >
                    {shipment.status === "Delivered" && <FaCheckCircle className="mr-1" />}
                    {shipment.status === "In Transit" && <FaHourglassHalf className="mr-1" />}
                    {shipment.status === "Pending" && <FaHourglassHalf className="mr-1" />}
                    {shipment.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}