import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";

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
          params: { userId: userInfo.id }, // Pass userId as query parameter
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
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="text-center p-6">Order not found.</div>;
  }

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
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to="/dashboard/orders" className="hover:underline">Orders</Link> / Order Details
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Order Details</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold">Order Information</h3>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={order.status === "Completed" ? "text-green-600" : "text-red-600"}>
                  {order.status}
                </span>
              </p>
              <p><strong>Payment Method:</strong> {order.paymentMethod || "N/A"}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Shipping Information</h3>
              <p>
                <strong>Name:</strong> {order.shippingInfo?.firstName || ""} {order.shippingInfo?.lastName || ""}
              </p>
              <p><strong>Email:</strong> {order.shippingInfo?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {order.shippingInfo?.phoneNumber || "N/A"}</p>
              <p>
                <strong>Address:</strong>{" "}
                {order.shippingInfo?.address || ""}{order.shippingInfo?.city ? `, ${order.shippingInfo.city}` : ""}{order.shippingInfo?.state ? `, ${order.shippingInfo.state}` : ""}{order.shippingInfo?.zipCode ? `, ${order.shippingInfo.zipCode}` : ""}{order.shippingInfo?.country ? `, ${order.shippingInfo.country}` : "" || "N/A"}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Items</h3>
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="border-b text-left bg-gray-100">
                <th className="p-3">Item</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Price</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{item.plantName}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">${item.itemPrice.toFixed(2)}</td>
                  <td className="p-3">${(item.quantity * item.itemPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {order.couponCode && (
            <div className="mb-4">
              <p><strong>Coupon Applied:</strong> {order.couponCode}</p>
              <p><strong>Discount:</strong> -${order.couponDiscount.toFixed(2)}</p>
            </div>
          )}

          <p className="text-lg font-bold">Final Total: ${order.total.toFixed(2)}</p>

          {order.reviews && order.reviews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Your Reviews</h3>
              {order.reviews.map((review, index) => (
                <div key={index} className="border-t pt-2 mt-2">
                  <p><strong>Rating:</strong> {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}</p>
                  <p><strong>Review:</strong> {review.review}</p>
                  <p><strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
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