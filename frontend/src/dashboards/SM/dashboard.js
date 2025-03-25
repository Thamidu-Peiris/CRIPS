// CRIPS\frontend\src\dashboards\SM\dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./sideBar.js";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaBox,
  FaUsers,
  FaTasks,
  FaUserCog,
  FaBell,
  FaTicketAlt,
  FaExclamationTriangle,
  FaBriefcase,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({ sales: 0, stock: 0, visitors: 0 });
  const [orders, setOrders] = useState([]);
  const [managerName, setManagerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setManagerName(user.name);
    } else {
      setManagerName("System Manager");
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Try to fetch visitor stats first
      const visitorsResponse = await axios.get("http://localhost:5000/api/visitor/stats");
      setStats(prevStats => ({
        ...prevStats,
        visitors: visitorsResponse.data.dayCount || 0,
      }));
  
      // Optional: Try other endpoints but ignore their errors for now
      try {
        const salesResponse = await axios.get("http://localhost:5000/api/stats/sales");
        const stockResponse = await axios.get("http://localhost:5000/api/stats/stock");
        const ordersResponse = await axios.get("http://localhost:5000/api/orders/recent");
  
        setStats(prevStats => ({
          ...prevStats,
          sales: salesResponse.data.total || 0,
          stock: stockResponse.data.total || 0,
        }));
        setOrders(ordersResponse.data || []);
      } catch (innerErr) {
        console.warn("Other APIs not ready:", innerErr);
        // Don't set error, so visitors still show
      }
  
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
      setError("Failed to load visitor data.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">System Manager Dashboard</h1>
              <p className="text-xl mt-2 font-light">Welcome, {managerName}!</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-300">
            <p>Loading dashboard data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex items-center">
              <FaDollarSign className="text-4xl text-cyan-400 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-gray-300">Sales</h2>
                <p className="text-3xl font-bold text-white">${stats.sales.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex items-center">
              <FaBox className="text-4xl text-pink-400 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-gray-300">Stock</h2>
                <p className="text-3xl font-bold text-white">{stats.stock.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex items-center">
              <FaUsers className="text-4xl text-orange-400 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-gray-300">Visitors</h2>
                <p className="text-3xl font-bold text-white">{stats.visitors.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Section */}
        {!loading && !error && (
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleQuickAction("/admin-applications")}
                className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl transition duration-300"
              >
                <FaTasks className="mr-2" /> View Job Applications
              </button>
              <button
                onClick={() => handleQuickAction("/manage-users")}
                className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl transition duration-300"
              >
                <FaUserCog className="mr-2" /> Manage Users
              </button>
            </div>
          </div>
        )}

        {/* System Overview Section */}
        {!loading && !error && (
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">System Overview</h2>
            <ul className="space-y-2">
              <li className="text-gray-300 flex items-center">
                <FaBriefcase className="mr-2 text-cyan-400" />
                Pending Job Applications: <span className="font-semibold ml-1 text-white">5</span>
              </li>
              <li className="text-gray-300 flex items-center">
                <FaTicketAlt className="mr-2 text-yellow-400" />
                Pending Support Tickets: <span className="font-semibold ml-1 text-white">3</span>
              </li>
              <li className="text-gray-300 flex items-center">
                <FaExclamationTriangle className="mr-2 text-red-400" />
                System Alerts: <span className="font-semibold ml-1 text-white">0</span>
              </li>
            </ul>
          </div>
        )}

        {/* Recent Orders Section */}
        {!loading && !error && (
          <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-300">No recent orders available.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className="border-b border-gray-700 py-2 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-white">{order.item}</span>
                      <p className="text-sm text-gray-400">
                        {new Date(order.date).toLocaleDateString()} | ${order.price.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      } flex items-center`}
                    >
                      {order.status === "Delivered" && <FaCheckCircle className="mr-1" />}
                      {order.status === "Pending" && <FaHourglassHalf className="mr-1" />}
                      {order.status === "Cancelled" && <FaTimesCircle className="mr-1" />}
                      {order.status || "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;