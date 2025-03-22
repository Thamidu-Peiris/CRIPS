//CRIPS\frontend\src\dashboards\CSM\CustomerServiceDashboard.js
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Added import for navigation
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CustomerServiceDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]); // Added state for tickets
  const [stats, setStats] = useState({
    totalOrders: 250,
    newOrders: 65,
    pendingPayments: 10,
    completedOrders: 126,
    pendingOrders: 40,
    activeOrders: 85,
    pendingTickets: 0, // Added pendingTickets to stats
  });
  const navigate = useNavigate(); // Added navigate hook

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/all");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/support");
        const pendingTicketsCount = response.data.filter(ticket => ticket.status === "Pending").length;
        setTickets(response.data);
        setStats(prevStats => ({
          ...prevStats,
          pendingTickets: pendingTicketsCount
        }));
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchOrders();
    fetchTickets();
  }, []);

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

  // Handle navigation to support tickets
  const handlePendingTicketsClick = () => {
    navigate("/dashboard/support-tickets");
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <CSMSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
        <CSMNavbar />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6"> {/* Changed to 5 columns */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "400px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "400px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Latest Orders Table */}
        <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
          <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 border border-gray-300">Order</th>
                  <th className="py-3 px-4 border border-gray-300">Status</th>
                  <th className="py-3 px-4 border border-gray-300">Payment</th>
                  <th className="py-3 px-4 border border-gray-300">Date</th>
                  <th className="py-3 px-4 border border-gray-300">Options</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.orderId} className="text-center border-b border-gray-300">
                    <td className="py-3 px-4">{order.orderId}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{order.paymentStatus}</td>
                    <td className="py-3 px-4">{new Date(order.date).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerServiceDashboard;