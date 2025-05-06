// frontend\src\dashboards\SalesManagerDashboard.js
/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SalesManagerNavbar from "../components/SalesManagerNavbar";
import SalesManagerSidebar from "../components/SalesManagerSidebar";

const SalesManagerDashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [topSellingPlants, setTopSellingPlants] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [topPlantsUnits, setTopPlantsUnits] = useState([]);
  const [salesSummary, setSalesSummary] = useState({
    units: 0,
    revenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for Pie Chart
  const COLORS = ['#4CAF50', '#FFCA28', '#2196F3', '#AB47BC', '#FF5722'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const apiUrl = "http://localhost:5000/api/sales-report/dashboard-data";
        console.log("Fetching from:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
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
        setOrderStatusDistribution(data.orderStatusDistribution || []);
        setTopPlantsUnits(data.topPlantsUnits || []);
        setSalesSummary({
          units: data.summary?.last7DaysUnits || 0,
          revenue: data.summary?.lastMonthRevenue || 0,
          totalOrders: data.summary?.totalOrders || 0,
          avgOrderValue: data.summary?.avgOrderValue || 0,
          pendingOrders: data.summary?.pendingOrders || 0,
          revenueGrowth: data.summary?.revenueGrowth || 0,
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
        

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Sales Summary</p>
            <p className="font-semibold text-sm text-gray-500">(Last 7 days)</p>
            <h2 className="text-2xl font-bold text-blue-600">{salesSummary.units} Units</h2>
            <Link to="/ProductReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Revenue </p>
            <p className="font-semibold text-sm text-gray-500">(Last 30 Days)</p>
            <h2 className="text-2xl font-bold text-blue-600">$ {salesSummary.revenue.toLocaleString()}</h2>
            <Link to="/FinancialReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Total Orders</p>
            <p className="font-semibold text-sm text-gray-500">(Last 30 Days)</p>
            <h2 className="text-2xl font-bold text-blue-600">{salesSummary.totalOrders}</h2>
            <Link to="/CustomerReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Avg. Order Value</p>
            <p className="font-semibold text-sm text-gray-500">(Last 30 Days)</p>
            <h2 className="text-2xl font-bold text-blue-600">$ {salesSummary.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
            <Link to="/FinancialReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Revenue Growth </p>
            <p className="font-semibold text-sm text-gray-500">(Last 30 Days)</p>
            <h2 className="text-2xl font-bold text-blue-600">{salesSummary.revenueGrowth.toFixed(2)}%</h2>
            <Link to="/FinancialReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-3">Revenue ($)</h2>
            <div style={{ height: "200px" }}>
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

          {/* Order Status Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-3">Order Status Distribution</h2>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {orderStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Plants Units Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-3">Top Plants Units Sold</h2>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPlantsUnits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="unitsSold" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Selling Plants
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
        </div> */}

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