import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";
import { motion } from "framer-motion";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [review, setReview] = useState({ rating: 0, review: "" });
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const navigate = useNavigate();

  const hasPendingOrApprovedReview = (order) => {
    return order.reviews.some(review => review.status === 'pending' || review.status === 'approved');
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/user/${userInfo.id}`);
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
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
        order._id === orderId ? { ...order, reviews: [...order.reviews, { ...review, status: 'pending' }] } : order
      ));
      setShowReviewModal(null);
      setReview({ rating: 0, review: "" });
      setSuccessMessage("Review submitted and is pending approval.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000); // Auto-clear after 5 seconds
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit review.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000); // Auto-clear after 5 seconds
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const openReviewModal = (orderId) => {
    setShowReviewModal(orderId);
  };

  const closeReviewModal = () => {
    setShowReviewModal(null);
    setReview({ rating: 0, review: "" });
  };

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

      <div className="px-4 pb-12">
        <div className="bg-white shadow-sm p-4 mx-4 mt-4 rounded-lg">
          <div className="text-gray-500 text-sm">
            <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> / Orders
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Your Orders</h2>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center max-w-7xl mx-auto"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center max-w-7xl mx-auto"
          >
            {errorMessage}
          </motion.div>
        )}

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
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                      {order.status === "Completed" && !hasPendingOrApprovedReview(order) && (
                        <button
                          onClick={() => openReviewModal(order._id)}
                          className="bg-green-600 text-white px-4 py-1 rounded-full font-medium hover:bg-green-700 transition"
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
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Order Details</h3>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Order Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-semibold">Order ID:</span> {selectedOrder._id}</p>
                    <p><span className="font-semibold">Status:</span> <span className={`inline-block px-2 py-1 rounded text-sm ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' : selectedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedOrder.status}</span></p>
                    <p><span className="font-semibold">Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                    <p><span className="font-semibold">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    {selectedOrder.couponCode && (
                      <p><span className="font-semibold">Coupon:</span> {selectedOrder.couponCode} (-${selectedOrder.couponDiscount.toFixed(2)})</p>
                    )}
                    {selectedOrder.trackingNumber && (
                      <p><span className="font-semibold">Tracking Number:</span> {selectedOrder.trackingNumber}</p>
                    )}
                    {selectedOrder.trackingLocation && (
                      <p><span className="font-semibold">Current Location:</span> {selectedOrder.trackingLocation}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-semibold">Name:</span> {selectedOrder.userId.firstName} {selectedOrder.userId.lastName}</p>
                    <p><span className="font-semibold">Email:</span> {selectedOrder.userId.email}</p>
                    <p><span className="font-semibold">Shipping Address:</span> {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}, {selectedOrder.shippingInfo.zipCode}, {selectedOrder.shippingInfo.country}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-semibold text-gray-800">{item.plantName}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-gray-800 font-medium">${(item.itemPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">Status History</h4>
                <div className="space-y-4">
                  {selectedOrder.statusHistory.map((history, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-semibold text-gray-700">Status:</span> {history.status}</p>
                      <p><span className="font-semibold text-gray-700">Updated:</span> {new Date(history.updatedAt).toLocaleString()}</p>
                      <p><span className="font-semibold text-gray-700">By:</span> {history.updatedBy.toString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add Review</h3>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
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
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={review.review}
                  onChange={(e) => setReview({ ...review, review: e.target.value })}
                  placeholder="Write your review..."
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                  rows="4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeReviewModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReviewSubmit(showReviewModal)}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                  disabled={review.rating === 0 || !review.review.trim()}
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;