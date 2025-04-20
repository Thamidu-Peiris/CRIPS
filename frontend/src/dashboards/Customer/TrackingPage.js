import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";

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
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
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
        <Link to="/dashboard/orders" className="hover:underline">Orders</Link> / Tracking
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Order Tracking</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left bg-gray-100">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tracking Number</th>
                  <th className="p-3">Current Location</th>
                  <th className="p-3">Status History</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">{order._id}</td>
                    <td className="p-3">
                      <span className={order.status === "Completed" ? "text-green-600" : "text-red-600"}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">{order.trackingNumber || "N/A"}</td>
                    <td className="p-3">{order.trackingLocation || "N/A"}</td>
                    <td className="p-3">
                      <ul className="list-disc list-inside">
                        {order.statusHistory.map((history, index) => (
                          <li key={index}>
                            {history.status} on {new Date(history.updatedAt).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
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