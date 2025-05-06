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
  const [customers, setCustomers] = useState([]);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    pendingCustomers: 0,
    completedOrders: 0,
    pendingTickets: 0,
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // Fetch orders
      const orderResponse = await axios.get("http://localhost:5000/api/orders");
      const ordersData = orderResponse.data;
      setOrders(ordersData);

      // Fetch tickets
      const ticketResponse = await axios.get("http://localhost:5000/api/support");
      const ticketsData = ticketResponse.data;
      setTickets(ticketsData);

      // Fetch approved customers (for new customers chart)
      const customerResponse = await axios.get("http://localhost:5000/api/csm/customers/approved");
      const customersData = customerResponse.data;
      setCustomers(customersData);

      // Fetch pending customers (for metric)
      const pendingCustomerResponse = await axios.get("http://localhost:5000/api/csm/customers/pending");
      const pendingCustomersData = pendingCustomerResponse.data;
      setPendingCustomers(pendingCustomersData);

      // Calculate stats
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(o => o.status === "Pending").length;
      const pendingCustomers = pendingCustomersData.length;
      const completedOrders = ordersData.filter(o => o.status === "Completed").length;
      const pendingTickets = ticketsData.filter(t => t.status === "Pending").length;

      setStats({
        totalOrders,
        pendingOrders,
        pendingCustomers,
        completedOrders,
        pendingTickets,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "Customer Service Manager") {
      navigate("/login");
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling interval (every 30 seconds)
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [navigate]);

  // Orders Over Time (Bar Chart)
  const getLast7Days = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const barChartData = {
    labels: getLast7Days().map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: "Orders",
        data: getLast7Days().map(date => {
          const startOfDay = new Date(date);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          return orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate >= startOfDay && orderDate <= endOfDay;
          }).length;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

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

  // Order Status Distribution (Pie Chart)
  const pieChartData = {
    labels: ["Pending Orders", "Active Orders"],
    datasets: [
      {
        data: [
          stats.pendingOrders,
          orders.filter(o => ["Confirmed", "Shipped"].includes(o.status)).length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF4D6D", "#2F86D6"],
      },
    ],
  };

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

  // New Customers (Last 7 Days) (Bar Chart)
  const newCustomersData = {
    labels: getLast7Days().map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: "New Approved Customers",
        data: getLast7Days().map(date => {
          const startOfDay = new Date(date);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          return customers.filter(c => {
            const approvalDate = new Date(c.approvedAt); // Use approvedAt instead of createdAt
            return approvalDate >= startOfDay && approvalDate <= endOfDay;
          }).length;
        }),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const newCustomersChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "New Approved Customers (Last 7 Days)", // Updated title for clarity
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

  const handleOrdersClick = () => {
    navigate("/csm/manage-orders");
  };

  const handlePendingTicketsClick = () => {
    navigate("/csm/support-tickets");
  };

  const handlePendingCustomersClick = () => {
    navigate("/csm/customer-requests");
  };

  // Get 3 latest orders
  const latestOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="flex h-screen bg-gray-200">
      <CSMSidebar />
      <main className="flex-1 p-6">
        <CSMNavbar />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          {[
            { title: "Total Orders", value: stats.totalOrders, onClick: handleOrdersClick, clickable: true },
            { title: "Pending Orders", value: stats.pendingOrders, onClick: handleOrdersClick, clickable: true },
            { title: "Pending Customers", value: stats.pendingCustomers, onClick: handlePendingCustomersClick, clickable: true },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "300px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "300px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "300px" }}>
            <Bar data={newCustomersData} options={newCustomersChartOptions} />
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
                {latestOrders.map((order) => (
                  <tr key={order._id} className="text-center border-b border-gray-300">
                    <td className="py-3 px-4">{order._id}</td>
                    <td className="py-3 px-4">{order.userId?.firstName} {order.userId?.lastName}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{order.paymentMethod || "N/A"}</td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate("/csm/manage-orders")}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Details
                      </button>
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