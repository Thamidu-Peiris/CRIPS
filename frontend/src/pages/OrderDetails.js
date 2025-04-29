import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";
import { motion } from "framer-motion";

const OrderDetails = () => {
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

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          params: { userId: userInfo.id },
        });
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.response?.data?.message || "Failed to load order details. Please try again.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return <div className="bg-white rounded-lg p-6 text-gray-600 text-center animate-fade-in max-w-4xl mx-auto mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center animate-fade-in max-w-4xl mx-auto mt-8">{error}</div>;
  }

  if (!order) {
    return <div className="bg-white rounded-lg p-6 text-gray-600 text-center animate-fade-in max-w-4xl mx-auto mt-8">Order not found.</div>;
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
            <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> /{" "}
            <Link to="/dashboard/orders" className="text-green-600 hover:text-green-700 transition">Orders</Link> / Order Details
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Order Details</h2>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Information</h3>
              <p className="mb-2"><span className="font-medium text-gray-700">Order ID:</span> <span className="text-gray-800">{order._id}</span></p>
              <p className="mb-2"><span className="font-medium text-gray-700">Date:</span> <span className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</span></p>
              <p className="mb-2">
                <span className="font-medium text-gray-700">Status:</span>{" "}
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
              </p>
              <p className="mb-2"><span className="font-medium text-gray-700">Payment Method:</span> <span className="text-gray-800">{order.paymentMethod || "N/A"}</span></p>
              <p className="mb-2"><span className="font-medium text-gray-700">Total:</span> <span className="text-gray-800">${order.total.toFixed(2)}</span></p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Shipping Information</h3>
              <p className="mb-2">
                <span className="font-medium text-gray-700">Name:</span> <span className="text-gray-800">{order.shippingInfo?.firstName || ""} {order.shippingInfo?.lastName || ""}</span>
              </p>
              <p className="mb-2"><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-800">{order.shippingInfo?.email || "N/A"}</span></p>
              <p className="mb-2"><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-800">{order.shippingInfo?.phoneNumber || "N/A"}</span></p>
              <p className="mb-2">
                <span className="font-medium text-gray-700">Address:</span> <span className="text-gray-800">
                  {order.shippingInfo?.address || ""}{order.shippingInfo?.city ? `, ${order.shippingInfo.city}` : ""}{order.shippingInfo?.state ? `, ${order.shippingInfo.state}` : ""}{order.shippingInfo?.zipCode ? `, ${order.shippingInfo.zipCode}` : ""}{order.shippingInfo?.country ? `, ${order.shippingInfo.country}` : "" || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">Items</h3>
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-left text-gray-800 font-semibold rounded-t-lg">
                  <th className="p-4">Item</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <motion.tr
                    key={index}
                    className={`border-b text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition-colors`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="p-4">{item.plantName}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">${item.itemPrice.toFixed(2)}</td>
                    <td className="p-4">${(item.quantity * item.itemPrice).toFixed(2)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.couponCode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="mb-2"><span className="font-medium text-gray-700">Coupon Applied:</span> <span className="text-gray-800">{order.couponCode}</span></p>
              <p className="mb-2"><span className="font-medium text-gray-700">Discount:</span> <span className="text-gray-800">-${order.couponDiscount.toFixed(2)}</span></p>
            </div>
          )}

          <p className="text-lg font-bold text-green-800">Final Total: ${order.total.toFixed(2)}</p>

          {order.reviews && order.reviews.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Reviews</h3>
              {order.reviews.map((review, index) => (
                <div key={index} className="border-t border-gray-200 pt-2 mt-2">
                  <p className="mb-1">
                    <span className="font-medium text-gray-700">Rating:</span>{" "}
                    <span className="text-yellow-400">{"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}</span>
                  </p>
                  <p className="mb-1"><span className="font-medium text-gray-700">Review:</span> <span className="text-gray-800">{review.review}</span></p>
                  <p className="mb-1"><span className="font-medium text-gray-700">Date:</span> <span className="text-gray-800">{new Date(review.createdAt).toLocaleDateString()}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;