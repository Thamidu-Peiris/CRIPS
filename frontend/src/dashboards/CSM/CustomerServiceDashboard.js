import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CustomerServiceDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    pendingPayments: 0,
    completedOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    pendingTickets: 0,
  });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "Customer Service Manager") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch orders
        const orderResponse = await axios.get("http://localhost:5000/api/orders");
        const ordersData = orderResponse.data;
        setOrders(ordersData);

        // Calculate stats
        const totalOrders = ordersData.length;
        const newOrders = ordersData.filter(o => o.status === "Pending").length;
        const pendingPayments = ordersData.filter(o => o.paymentMethod === "Pending").length;
        const completedOrders = ordersData.filter(o => o.status === "Completed").length;
        const pendingOrders = ordersData.filter(o => o.status === "Pending").length;
        const activeOrders = ordersData.filter(o => ["Confirmed", "Shipped"].includes(o.status)).length;

        // Fetch tickets
        const ticketResponse = await axios.get("http://localhost:5000/api/support");
        const ticketsData = ticketResponse.data;
        setTickets(ticketsData);
        const pendingTickets = ticketsData.filter(t => t.status === "Pending").length;

        setStats({
          totalOrders,
          newOrders,
          pendingPayments,
          completedOrders,
          pendingOrders,
          activeOrders,
          pendingTickets,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusUpdate = async (orderId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
        updatedBy: userInfo.id,
      });
      setOrders(orders.map(order =>
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

  // Bar Chart Data (Orders Over Time)
  const barChartData = {
    labels: ["Feb-01", "Feb-02", "Feb-03", "Feb-04", "Feb-05", "Feb-06"],
    datasets: [
      {
        label: "Orders",
        data: [5, 10, 3, 12, 8, 18],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "Orders Over Time",
        font: { size: 16 },
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: { padding: 10 },
        grid: { display: false },
      },
      y: { beginAtZero: true },
    },
  };

  // Pie Chart Data (Pending vs. Active Orders)
  const pieChartData = {
    labels: ["Pending Orders", "Active Orders"],
    datasets: [
      {
        data: [stats.pendingOrders, stats.activeOrders],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF4D6D", "#2F86D6"],
      },
    ],
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Order Status Distribution",
        font: { size: 16 },
        padding: { top: 10, bottom: 20 },
      },
    },
  };

  const handlePendingTicketsClick = () => {
    navigate("/csm/support-tickets");
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <CSMSidebar />
      <main className="flex-1 p-6">
        <CSMNavbar />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          {[
            { title: "Total Orders", value: stats.totalOrders },
            { title: "New Orders", value: stats.newOrders },
            { title: "Pending Payments", value: stats.pendingPayments },
            { title: "Completed Orders", value: stats.completedOrders },
            { 
              title: "Pending Tickets", 
              value: stats.pendingTickets,
              onClick: handlePendingTicketsClick,
              clickable: true
            },
          ].map((item, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-2xl shadow-md text-center ${item.clickable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={item.onClick}
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-3xl font-bold text-blue-600">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "400px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "400px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
          <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 border border-gray-300">Order ID</th>
                  <th className="py-3 px-4 border border-gray-300">Customer</th>
                  <th className="py-3 px-4 border border-gray-300">Status</th>
                  <th className="py-3 px-4 border border-gray-300">Payment</th>
                  <th className="py-3 px-4 border border-gray-300">Date</th>
                  <th className="py-3 px-4 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="text-center border-b border-gray-300">
                    <td className="py-3 px-4">{order._id}</td>
                    <td className="py-3 px-4">{order.userId?.firstName} {order.userId?.lastName}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{order.paymentMethod || "N/A"}</td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedOrderId(order._id);
                          setNewStatus(order.status);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedOrderId && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Update Order Status</h3>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="p-2 border rounded mr-2"
              >
                {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed'].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={() => handleStatusUpdate(selectedOrderId)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerServiceDashboard;