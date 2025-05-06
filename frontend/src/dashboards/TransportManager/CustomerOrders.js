import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newLocation, setNewLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "TransportManager") {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleLocationUpdate = async (orderId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(`http://localhost:5000/api/orders/${orderId}/location`, {
        trackingLocation: newLocation,
        updatedBy: userInfo.id,
      });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, trackingLocation: newLocation } : order
      ));
      setSelectedOrderId(null);
      setNewLocation("");
      alert("Order location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update order location.");
    }
  };

  if (loading) {
    return <div className="text-center p-6 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Customer Orders
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            View and manage customer orders
          </p>
        </header>

        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">Order List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-gray-800 font-semibold">Order ID</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Customer</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Status</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Tracking Number</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Current Location</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                    <td className="py-3 px-4">{order._id}</td>
                    <td className="py-3 px-4">{order.userId?.firstName} {order.userId?.lastName}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{order.trackingNumber || "N/A"}</td>
                    <td className="py-3 px-4">{order.trackingLocation || "N/A"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedOrderId(order._id);
                          setNewLocation(order.trackingLocation || "");
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300"
                        disabled={order.status !== "Shipped" && order.status !== "Delivered"}
                      >
                        Update Location
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedOrderId && (
            <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                Update Order Location
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Enter new location"
                  className="p-2 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                />
                <button
                  onClick={() => handleLocationUpdate(selectedOrderId)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}