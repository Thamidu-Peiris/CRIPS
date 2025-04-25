import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";

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
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}?userId=${userInfo.id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order status history. Please try again.");
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="text-center p-6 text-gray-500">Order not found.</div>;
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
        <Link to="/dashboard/orders" className="hover:underline">Orders</Link> /{" "}
        <Link to="/dashboard/tracking" className="hover:underline">Tracking</Link> / Status History
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Status History for Order {order._id}</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {order.statusHistory.length === 0 ? (
            <p className="text-center text-gray-500">No status history available.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left bg-gray-100">
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Updated By</th>
                </tr>
              </thead>
              <tbody>
                {order.statusHistory.map((history, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">
                      <span className={history.status === "Completed" ? "text-green-600" : "text-red-600"}>
                        {history.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(history.updatedAt).toLocaleString()}</td>
                    <td className="p-3">{history.updatedBy || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard/tracking")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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