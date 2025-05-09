import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../dashboards/SM/sideBar";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaTasks,
  FaUserCog,
  FaBriefcase,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTruck,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    visitors: 0,
    pendingJobs: 0,
    pendingSuppliers: 0,
    pendingFeedback: 0,
    activeShipments: 0,
    pendingOrders: 0,
  });
  const [orders, setOrders] = useState([]);
  const [managerName, setManagerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setManagerName(user.name);
    } else {
      setManagerName("System Manager");
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrors([]);

      // Fetch visitor stats
      try {
        const visitorsResponse = await axios.get("http://localhost:5000/api/visitor/stats");
        setStats(prevStats => ({
          ...prevStats,
          visitors: visitorsResponse.data.dayCount || 0,
        }));
      } catch (visitorErr) {
        console.error("Error fetching visitor stats:", visitorErr);
        setErrors(prev => [...prev, "Failed to load visitor data."]);
      }

      // Fetch all job applications and calculate pending job applications count
      try {
        const token = localStorage.getItem("token");
        const applicationsResponse = await axios.get("http://localhost:5000/api/jobs/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingJobsCount = applicationsResponse.data.data.filter(app => app.status === "pending").length;
        setStats(prevStats => ({
          ...prevStats,
          pendingJobs: pendingJobsCount || 0,
        }));
      } catch (jobsErr) {
        console.error("Error fetching job applications for pending count:", jobsErr);
        setErrors(prev => [...prev, "Failed to load pending job applications."]);
      }

      // Fetch all pending supplier applications and calculate pending supplier applications count
      try {
        const token = localStorage.getItem("token");
        const suppliersResponse = await axios.get("http://localhost:5000/api/suppliers/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingSuppliersCount = suppliersResponse.data.suppliers.filter(supplier => supplier.status === "pending").length;
        setStats(prevStats => ({
          ...prevStats,
          pendingSuppliers: pendingSuppliersCount || 0,
        }));
      } catch (suppliersErr) {
        console.error("Error fetching pending supplier applications:", suppliersErr);
        setErrors(prev => [...prev, "Failed to load pending supplier applications."]);
      }

      // Fetch all reviews and calculate pending feedback count
      try {
        const token = localStorage.getItem("token");
        const reviewsResponse = await axios.get("http://localhost:5000/api/user-feed/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingFeedbackCount = reviewsResponse.data.data.filter(review => review.status === "pending").length;
        setStats(prevStats => ({
          ...prevStats,
          pendingFeedback: pendingFeedbackCount || 0,
        }));
      } catch (feedbackErr) {
        console.error("Error fetching reviews for pending feedback count:", feedbackErr);
        setErrors(prev => [...prev, "Failed to load pending feedback."]);
      }

      // Fetch active shipments
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }
        const transportStatsResponse = await axios.get("http://localhost:5000/api/transport/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = transportStatsResponse.data || {};
        setStats(prevStats => ({
          ...prevStats,
          activeShipments: data.activeShipments || 0,
        }));
      } catch (transportErr) {
        console.error("Error fetching transport stats:", transportErr);
        setErrors(prev => [...prev, "Failed to load active shipments data."]);
      }

      // Fetch all orders, calculate pending order count, and filter the most recent ones
      try {
        const token = localStorage.getItem("token");
        const ordersResponse = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Calculate pending order count
        const pendingOrdersCount = ordersResponse.data.filter(order => order.status === "Pending").length;
        setStats(prevStats => ({
          ...prevStats,
          pendingOrders: pendingOrdersCount || 0,
        }));

        // Transform orders to match the expected structure for Dashboard.js
        const transformedOrders = ordersResponse.data
          .filter(order => order._id && order.status)
          .map(order => ({
            _id: order._id,
            item: order.item || "Unknown Item",
            date: order.createdAt || new Date().toISOString(),
            price: order.price !== undefined ? order.price : 0,
            status: order.status || "Pending",
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setOrders(transformedOrders || []);
      } catch (ordersErr) {
        console.error("Error fetching orders:", ordersErr);
        setErrors(prev => [...prev, "Failed to load recent orders or pending order count."]);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setErrors(prev => [...prev, "An unexpected error occurred while loading dashboard data."]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  // Data for Bar Chart (System Metrics)
  const barChartData = {
    labels: [
      "Active Shipments",
      "Pending Orders",
      "Visitors",
      "Pending Jobs",
      "Pending Suppliers",
      "Pending Feedback",
    ],
    datasets: [
      {
        label: "Count",
        data: [
          stats.activeShipments,
          stats.pendingOrders,
          stats.visitors,
          stats.pendingJobs,
          stats.pendingSuppliers,
          stats.pendingFeedback,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)",  // Green for Active Shipments
          "rgba(59, 130, 246, 0.6)", // Blue for Pending Orders
          "rgba(234, 179, 8, 0.6)",  // Yellow for Visitors
          "rgba(139, 92, 246, 0.6)", // Purple for Pending Jobs
          "rgba(249, 115, 22, 0.6)", // Orange for Pending Suppliers
          "rgba(239, 68, 68, 0.6)",  // Red for Pending Feedback
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for Pie Chart (Order Status Distribution)
  const orderStatusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(orderStatusCounts),
    datasets: [
      {
        label: "Order Status",
        data: Object.values(orderStatusCounts),
        backgroundColor: [
          "rgba(234, 179, 8, 0.6)",  // Yellow for Pending
          "rgba(236, 72, 153, 0.6)", // Pink for Shipped
          "rgba(34, 197, 94, 0.6)",  // Green for Delivered
          "rgba(239, 68, 68, 0.6)",  // Red for Cancelled
        ],
        borderColor: [
          "rgba(234, 179, 8, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-teal-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Updated Header */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-green-900">System Manager Dashboard</h1>
              <p className="text-xl mt-2 font-light text-gray-600">Welcome, {managerName}!</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-600">
            <p>Loading dashboard data...</p>
          </div>
        )}

        {/* Error State */}
        {errors.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
            {errors.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex items-center">
              <FaTruck className="text-4xl text-green-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-green-900">Active Shipments</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.activeShipments}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex items-center">
              <FaShoppingCart className="text-4xl text-green-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-green-900">Pending Orders</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex items-center">
              <FaUsers className="text-4xl text-green-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-green-900">Visitors</h2>
                <p className="text-3xl font-bold text-gray-800">{stats.visitors.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleQuickAction("/admin-applications")}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300"
              >
                <FaTasks className="mr-2" /> View Job Applications
              </button>
              <button
                onClick={() => handleQuickAction("/manage-users")}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition duration-300"
              >
                <FaUserCog className="mr-2" /> Manage Users
              </button>
            </div>
          </div>
        )}

        {/* System Overview Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">System Overview</h2>
            <ul className="space-y-2">
              <li className="text-gray-600 flex items-center">
                <FaBriefcase className="mr-2 text-green-500" />
                Pending Job Applications: <span className="font-semibold ml-1 text-gray-800">{stats.pendingJobs}</span>
              </li>
              <li className="text-gray-600 flex items-center">
                <FaTruck className="mr-2 text-blue-500" />
                Pending Supplier Applications: <span className="font-semibold ml-1 text-gray-800">{stats.pendingSuppliers}</span>
              </li>
              <li className="text-gray-600 flex items-center">
                <FaStar className="mr-2 text-yellow-500" />
                Pending Feedback: <span className="font-semibold ml-1 text-gray-800">{stats.pendingFeedback}</span>
              </li>
            </ul>
          </div>
        )}

        {/* Data Analytics Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Data Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart for System Metrics */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">System Metrics Overview</h3>
                <div className="h-80">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </div>

              {/* Pie Chart for Order Status Distribution */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Order Status Distribution</h3>
                <div className="h-80 flex justify-center">
                  <div className="w-64">
                    <Pie data={pieChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No recent orders available.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className="border-b border-gray-200 py-2 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-gray-800">{order.item || "Unknown Item"}</span>
                      <p className="text-sm text-gray-500">
                        {order.date ? new Date(order.date).toLocaleDateString() : "Unknown Date"} | ${order.price ? order.price.toLocaleString() : "0"}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      } flex items-center`}
                    >
                      {order.status === "Delivered" && <FaCheckCircle className="mr-1" />}
                      {order.status === "Pending" && <FaHourglassHalf className="mr-1" />}
                      {order.status === "Cancelled" && <FaTimesCircle className="mr-1" />}
                      {order.status || "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;