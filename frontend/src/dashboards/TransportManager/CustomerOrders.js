import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newLocation, setNewLocation] = useState("");
  const navigate = useNavigate(); // Initialize navigate

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
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />
      <div className="flex-1 ml-72 p-8">
        <header className="p-6 bg-gradient-to-r from-cyan-600/90 to-blue-700/90 rounded-2xl shadow-xl backdrop-blur-md border border-cyan-500/20">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Customer Orders
          </h1>
          <p className="text-lg mt-2 font-light text-cyan-100/80">
            View and manage customer orders
          </p>
        </header>
        <div className="mt-8 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6">Order List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Tracking Number</th>
                  <th className="py-2 px-4">Current Location</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-700/50 hover:bg-gray-800/30">
                    <td className="py-2 px-4">{order._id}</td>
                    <td className="py-2 px-4">{order.userId?.firstName} {order.userId?.lastName}</td>
                    <td className="py-2 px-4">{order.status}</td>
                    <td className="py-2 px-4">{order.trackingNumber || "N/A"}</td>
                    <td className="py-2 px-4">{order.trackingLocation || "N/A"}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => {
                          setSelectedOrderId(order._id);
                          setNewLocation(order.trackingLocation || "");
                        }}
                        className="bg-blue-500/80 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
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
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Update Order Location</h3>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter new location"
                className="p-2 border rounded mr-2 bg-gray-900/50 text-white"
              />
              <button
                onClick={() => handleLocationUpdate(selectedOrderId)}
                className="bg-green-500/80 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="ml-2 bg-gray-500/80 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}