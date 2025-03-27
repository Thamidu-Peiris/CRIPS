import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";

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
    <div className="font-sans min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>
        <CustomerHeader />
      </nav>

      <div className="text-gray-500 mb-4 p-6">
        <Link to="/" className="hover:underline">Home</Link> / Orders
      </div>

      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Orders</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left bg-gray-100">
                <th className="p-3">Order</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Options</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b text-sm">
                    <td className="p-3">{order._id}</td>
                    <td className="p-3">${order.total.toFixed(2)}</td>
                    <td className="p-3">{order.paymentMethod}</td>
                    <td className={`p-3 font-semibold ${order.status === "Completed" ? "text-green-600" : "text-red-600"}`}>
                      {order.status}
                    </td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">View</Link>
                      {order.status === "Completed" && (
                        <button
                          onClick={() => setShowReviewForm(order._id)}
                          className="ml-2 text-green-600 hover:underline"
                        >
                          Add Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">No records found!</td>
                </tr>
              )}
            </tbody>
          </table>
          {showReviewForm && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Add Review</h3>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setReview({ ...review, rating: i + 1 })}
                    className={`text-2xl cursor-pointer ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={review.review}
                onChange={(e) => setReview({ ...review, review: e.target.value })}
                placeholder="Write your review..."
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={() => handleReviewSubmit(showReviewForm)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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