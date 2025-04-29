import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";
import { motion } from "framer-motion";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [review, setReview] = useState({ rating: 0, review: "" });
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
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleReviewSubmit = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/orders/${orderId}/review`, review);
      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, reviews: [...order.reviews, review] } : order
      ));
      setShowReviewForm(null);
      setReview({ rating: 0, review: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

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
            to="/careers"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Careers
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
            <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> / Orders
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Your Orders</h2>

        <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto animate-fade-in">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 text-left text-gray-800 font-semibold rounded-t-lg">
                <th className="p-4">Order</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tracking Number</th>
                <th className="p-4">Current Location</th>
                <th className="p-4">Date</th>
                <th className="p-4">Options</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    className={`border-b text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition-colors`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">${order.total.toFixed(2)}</td>
                    <td className="p-4">{order.paymentMethod || "N/A"}</td>
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
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 flex gap-2">
                      <Link to={`/orders/${order._id}`} className="text-green-600 hover:text-green-700 font-medium">View</Link>
                      {order.status === "Completed" && (
                        <button
                          onClick={() => setShowReviewForm(order._id)}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Add Review
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="bg-white rounded-lg p-6 text-gray-600 text-center">
                    No records found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {showReviewForm && (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add Review</h3>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setReview({ ...review, rating: i + 1 })}
                    className={`text-2xl cursor-pointer transition-colors ${i < review.rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                  Your Review
                </label>
                <textarea
                  value={review.review}
                  onChange={(e) => setReview({ ...review, review: e.target.value })}
                  placeholder="Write your review..."
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                  rows="4"
                />
              </div>
              <button
                onClick={() => handleReviewSubmit(showReviewForm)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 mt-4"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;