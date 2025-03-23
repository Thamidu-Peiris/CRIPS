// CRIPS\frontend\src\dashboards\SM\dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './sideBar.js'; // ✅ Correct path
import { useNavigate } from "react-router-dom"; // For navigation
import { FaDollarSign, FaBox, FaUsers, FaSignOutAlt, FaTasks, FaUserCog } from "react-icons/fa"; // Icons for visual appeal

const Dashboard = () => {
    const [stats, setStats] = useState({ sales: 0, stock: 0, visitors: 0 });
    const [orders, setOrders] = useState([]);
    const [managerName, setManagerName] = useState(""); // State for manager's name
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        // Fetch manager's name from localStorage (assuming it's stored after login)
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name) {
            setManagerName(user.name);
        } else {
            setManagerName("System Manager"); // Fallback name
        }

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const salesResponse = await axios.get("http://localhost:4000/api/stats/sales");
            const stockResponse = await axios.get("http://localhost:4000/api/stats/stock");
            const visitorsResponse = await axios.get("http://localhost:4000/api/stats/visitors");
            const ordersResponse = await axios.get("http://localhost:4000/api/orders/recent");

            setStats({
                sales: salesResponse.data.total,
                stock: stockResponse.data.total,
                visitors: visitorsResponse.data.total,
            });
            setOrders(ordersResponse.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear localStorage and redirect to login page
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleQuickAction = (path) => {
        navigate(path); // Navigate to the specified path
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="ml-64 flex-1 p-6">
                {/* Header with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">System Manager Dashboard</h1>
                            <p className="text-lg mt-2">Welcome, {managerName}!</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                        >
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center text-gray-600">
                        <p>Loading dashboard data...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center">
                            <FaDollarSign className="text-4xl text-blue-500 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Sales</h2>
                                <p className="text-3xl font-bold text-gray-900">${stats.sales.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center">
                            <FaBox className="text-4xl text-green-500 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Stock</h2>
                                <p className="text-3xl font-bold text-gray-900">{stats.stock.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center">
                            <FaUsers className="text-4xl text-purple-500 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Visitors</h2>
                                <p className="text-3xl font-bold text-gray-900">{stats.visitors.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Section */}
                {!loading && !error && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleQuickAction("/admin-applications")}
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                                <FaTasks className="mr-2" /> View Job Applications
                            </button>
                            <button
                                onClick={() => handleQuickAction("/manage-users")}
                                className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                                <FaUserCog className="mr-2" /> Manage Users
                            </button>
                        </div>
                    </div>
                )}

                {/* System Overview Section (Placeholder) */}
                {!loading && !error && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">System Overview</h2>
                        <ul className="space-y-2">
                            <li className="text-gray-600">Pending Job Applications: <span className="font-semibold">5</span></li>
                            <li className="text-gray-600">Pending Support Tickets: <span className="font-semibold">3</span></li>
                            <li className="text-gray-600">System Alerts: <span className="font-semibold">0</span></li>
                        </ul>
                    </div>
                )}

                {/* Recent Orders Section */}
                {!loading && !error && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
                        {orders.length === 0 ? (
                            <p className="text-gray-600">No recent orders available.</p>
                        ) : (
                            <ul className="space-y-4">
                                {orders.map((order) => (
                                    <li
                                        key={order._id}
                                        className="border-b py-2 flex justify-between items-center"
                                    >
                                        <div>
                                            <span className="font-medium text-gray-800">{order.item}</span>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.date).toLocaleDateString()} | ${order.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-sm px-3 py-1 rounded-full ${
                                                order.status === "Delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
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