import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "Customer Service Manager") {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        // Sort orders by createdAt in descending order (latest first)
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleStatusUpdate = async (orderId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
        updatedBy: userInfo.id,
      });
      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      setSelectedOrderId(null);
      setNewStatus("");
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <CSMSidebar />
      <main className="flex-1 p-6">
        <CSMNavbar />
        <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
          <h3 className="text-lg font-semibold mb-4"></h3>
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 border border-gray-300">Order ID</th>
                  <th className="py-3 px-4 border border-gray-300">Customer</th>
                  <th className="py-3 px-4 border border-gray-300">Status</th>
                  <th className="py-3 px-4 border border-gray-300">Payment</th>
                  <th className="py-3 px-4 border border-gray-300">Tracking Number</th>
                  <th className="py-3 px-4 border border-gray-300">Date</th>
                  <th className="py-3 px-4 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="text-center border-b border-gray-300">
                    <td className="py-3 px-4">{order._id}</td>
                    <td className="py-3 px-4">{order.userId?.firstName} {order.userId?.lastName}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{order.paymentMethod || "N/A"}</td>
                    <td className="py-3 px-4">{order.trackingNumber || "N/A"}</td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrderId(order._id);
                            setNewStatus(order.status);
                          }}
                          className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                        >
                          Update Status
                        </button>
                        {selectedOrderId === order._id && (
                          <div className="flex items-center space-x-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[120px]"
                            >
                              {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            {newStatus !== order.status && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleStatusUpdate(order._id)}
                                  className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-lg hover:bg-green-700 transition"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setSelectedOrderId(null)}
                                  className="bg-gray-500 text-white text-sm font-medium px-3 py-1 rounded-lg hover:bg-gray-600 transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Previous
            </button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageOrders;