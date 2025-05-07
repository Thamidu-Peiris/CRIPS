import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";
import { motion } from "framer-motion";

const OrderStatusHistory = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          params: { userId: userInfo.id },
        });
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        console.log("Error response:", error.response);
        let errorMessage = "Failed to load order status history. Please try again later.";
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = "Order not found. Please check the order ID.";
          } else if (error.response.status === 403) {
            errorMessage = "Unauthorized access. Please ensure you are logged in with the correct account.";
          } else if (error.response.status === 400) {
            errorMessage = "Invalid request. Please check the order ID or contact support.";
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          }
        }
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 text-gray-600 text-center animate-fade-in max-w-4xl mx-auto mt-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center animate-fade-in max-w-4xl mx-auto mt-8">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg p-6 text-gray-600 text-center animate-fade-in max-w-4xl mx-auto mt-8">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pt-0">
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

      <div className="px-4 pb-12">
        <div className="bg-white shadow-sm p-4 mx-4 mt-4 rounded-lg">
          <div className="text-gray-500 text-sm">
            <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> /{" "}
            <Link to="/dashboard/orders" className="text-green-600 hover:text-green-700 transition">Orders</Link> /{" "}
            <Link to="/dashboard/tracking" className="text-green-600 hover:text-green-700 transition">Tracking</Link> / Status History
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Status History for Order {order._id}</h2>
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl mx-auto animate-fade-in">
          {order.statusHistory.length === 0 ? (
            <p className="bg-white rounded-lg p-6 text-gray-600 text-center animate-fade-in">No status history available.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-left text-gray-800 font-semibold rounded-t-lg">
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Updated By</th>
                </tr>
              </thead>
              <tbody>
                {order.statusHistory.map((history, index) => (
                  <motion.tr
                    key={index}
                    className={`border-b text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition-colors`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="p-4">
                      <button
                        className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                          history.status === "Pending"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : history.status === "Completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        disabled
                      >
                        {history.status}
                      </button>
                    </td>
                    <td className="p-4">{new Date(history.updatedAt).toLocaleString()}</td>
                    <td className="p-4">{history.updatedBy ? history.updatedBy.toString() : "N/A"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/dashboard/tracking")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300"
            >
              Back to Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusHistory;