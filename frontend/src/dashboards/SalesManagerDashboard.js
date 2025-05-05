// frontend\src\dashboards\SalesManagerDashboard.js
/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import SalesManagerNavbar from "../components/SalesManagerNavbar";
import SalesManagerSidebar from "../components/SalesManagerSidebar";

const SalesManagerDashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [topSellingPlants, setTopSellingPlants] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesSummary, setSalesSummary] = useState({ units: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const apiUrl = "http://localhost:5000/api/sales-report/dashboard-data"; // Use absolute URL to bypass proxy issues
        // const apiUrl = "/api/sales-report/dashboard-data"; // Switch to relative URL after fixing proxy
        console.log("Fetching from:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            // Uncomment if authentication is required
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Response Status:", response.status);
        console.log("Response Headers:", [...response.headers.entries()]);

        if (!response.ok) {
          const text = await response.text();
          console.error("Error Response (full):", text);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON Response (full):", text);
          throw new Error(`Response is not JSON: Content-Type is ${contentType}`);
        }

        const data = await response.json();
        console.log("Received Data:", data);

        setRevenueData(data.revenueData || []);
        setTopSellingPlants(data.topSellingPlants || []);
        setRecentOrders(data.recentOrders || []);
        setSalesSummary({
          units: data.summary?.last7DaysUnits || 0,
          revenue: data.summary?.lastMonthRevenue || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-200">
        <SalesManagerSidebar />
        <main className="flex-1 p-6">
          <SalesManagerNavbar />
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-200">
        <SalesManagerSidebar />
        <main className="flex-1 p-6">
          <SalesManagerNavbar />
          <div className="text-center text-red-600">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <h1 className="text-3xl font-bold text-green-600 mt-6 text-center">Sales and Report Dashboard</h1>
        <p className="text-center text-gray-600">Welcome to the Sales Dashboard</p>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Sales Summary (Last 7 days)</p>
            <h2 className="text-2xl font-bold text-blue-600">{salesSummary.units} Units</h2>
            <Link to="/ProductReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Revenue (Last 30 Days)</p>
            <h2 className="text-2xl font-bold text-blue-600">$ {salesSummary.revenue.toLocaleString()}</h2>
            <Link to="/FinancialReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-3">Revenue ($)</h2>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Plants */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Top Selling Plants</h2>
            <Link to="/ProductReport" className="text-blue-500">See details</Link>
          </div>
          <div className="flex justify-around">
            {topSellingPlants.map((plant) => (
              <div key={plant.id} className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mx-auto">
                  <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                </div>
                <p className="mt-2 font-semibold">{plant.name}</p>
                <p className="text-sm text-gray-600">Units Sold: {plant.sold}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link to="/CustomerReport" className="text-blue-500">See details</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3">Order ID</th>
                  <th className="border border-gray-300 p-3">Customer</th>
                  <th className="border border-gray-300 p-3">Amount ($)</th>
                  <th className="border border-gray-300 p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-center">
                    <td className="border border-gray-300 p-3">{order.id}</td>
                    <td className="border border-gray-300 p-3">{order.customer}</td>
                    <td className="border border-gray-300 p-3">$ {order.amount.toLocaleString()}</td>
                    <td
                      className={`border border-gray-300 p-3 font-semibold ${
                        order.status === "Completed"
                          ? "text-green-600"
                          : order.status === "Pending"
                          ? "text-yellow-600"
                          : order.status === "Shipped"
                          ? "text-blue-600"
                          : order.status === "Delivered"
                          ? "text-purple-600"
                          : order.status === "Confirmed"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
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

export default SalesManagerDashboard;