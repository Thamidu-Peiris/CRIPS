// frontend\src\dashboards\SalesManagerDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import SalesManagerNavbar from "../components/SalesManagerNavbar";
import SalesManagerSidebar from "../components/SalesManagerSidebar";

const data = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 20000 },
  { month: "Apr", revenue: 1000 },
  { month: "May", revenue: 12000 },
  { month: "Jun", revenue: 5000 },
  { month: "Jul", revenue: 25000 },
  { month: "Aug", revenue: 6000 },
  { month: "Sep", revenue: 3000 },
  { month: "Oct", revenue: 17000 },
  { month: "Nov", revenue: 10000 },
  { month: "Dec", revenue: 47000 },
];

const topSellingPlants = [
  { id: 1, name: "Plant 1", sold: 600, image: "plant1.jpg" },
  { id: 2, name: "Plant 2", sold: 543, image: "plant2.jpg" },
  { id: 3, name: "Plant 3", sold: 420, image: "plant3.jpg" },
];

const recentOrders = [
  { id: "001", customer: "A", amount: 500, status: "Complete" },
  { id: "002", customer: "B", amount: 1500, status: "Pending" },
  { id: "003", customer: "C", amount: 3500, status: "Complete" },
  { id: "004", customer: "D", amount: 600, status: "Canceled" },
  { id: "005", customer: "E", amount: 5000, status: "Pending" },
];

const SalesManagerDashboard = () => {
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
            <h2 className="text-2xl font-bold text-blue-600">345 Units</h2>
            <Link to="/ProductReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Total Revenue (Last month)</p>
            <h2 className="text-2xl font-bold text-blue-600">Rs. 26,500</h2>
            <Link to="/FinancialReport" className="text-blue-500 mt-2 inline-block">See details</Link>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-3">Revenue (Rs.)</h2>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
                  <th className="border border-gray-300 p-3">Amount (Rs.)</th>
                  <th className="border border-gray-300 p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-center">
                    <td className="border border-gray-300 p-3">{order.id}</td>
                    <td className="border border-gray-300 p-3">{order.customer}</td>
                    <td className="border border-gray-300 p-3">{order.amount}</td>
                    <td
                      className={`border border-gray-300 p-3 font-semibold ${
                        order.status === "Complete"
                          ? "text-green-600"
                          : order.status === "Pending"
                          ? "text-yellow-600"
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
