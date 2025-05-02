import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";
import { motion } from "framer-motion";

const TrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/user/${userInfo.id}`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div className="bg-white rounded-lg p-6 text-gray-600 text-center animate-fade-in max-w-4xl mx-auto mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center animate-fade-in max-w-4xl mx-auto mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-green-50 pt-0">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-12 transition-transform hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/dashboard/orders"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Orders
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Content */}
      <div className="px-4 pb-12">
        <div className="bg-white shadow-sm p-4 mx-4 mt-4 rounded-lg">
          <div className="text-gray-500 text-sm">
            <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> /{" "}
            <Link to="/dashboard/orders" className="text-green-600 hover:text-green-700 transition">Orders</Link> / Tracking
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Order Tracking</h2>
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl mx-auto animate-fade-in">
          {orders.length === 0 ? (
            <p className="bg-white rounded-lg p-6 text-gray-600 text-center animate-fade-in">No orders found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-left text-gray-800 font-semibold rounded-t-lg">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tracking Number</th>
                  <th className="p-4">Current Location</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    className={`border-b text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition-colors`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">
                      <button
                        className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                          order.status === "Pending"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : order.status === "Completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        disabled
                      >
                        {order.status}
                      </button>
                    </td>
                    <td className="p-4">{order.trackingNumber || "N/A"}</td>
                    <td className="p-4">{order.trackingLocation || "N/A"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/orders/${order._id}/status-history`)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300"
                      >
                        View Status
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;