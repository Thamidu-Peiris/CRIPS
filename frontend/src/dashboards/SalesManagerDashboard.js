// CRIPS\frontend\src\dashboards\SalesManagerDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

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
  { id: 4, name: "Plant 4", sold: 382, image: "plant4.jpg" },
  { id: 5, name: "Plant 5", sold: 151, image: "hero-image2.jpg" },
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
    <div className="flex h-parent">
      {/* Sidebar */}
      <div className="w-[275px] bg-gray-300 p-5">
        <h2 className="text-xl font-bold mb-5">Side Bar</h2>
        <ul className="space-y-5">
          <li><Link to="/" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">🏠 Home</Link></li>
          <li><Link to="/FinancialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📊 Financial Report</Link></li>
          <li><Link to="/ProductReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📦 Products Report</Link></li>
          <li><Link to="/CustomerReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">👥 Customer Reports</Link></li>
          <li><Link to="/SalarySheet" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">💰 Employee Salary Sheet</Link></li>
          <li><Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300"> ⚙ Settings</Link></li>
        </ul>
      </div>


      {/* Main Content */}
      <div className="w-4/5 p-10 text-center">
        <h1 className="text-3xl font-bold text-green-600">Sales and Report Dashboard Page</h1>
        <p>Welcome to the Sales Dashboard</p>

        {/* Summary Cards */}
        <div className="mt-10 flex justify-center gap-10">
          <div className="bg-white shadow-lg rounded-lg p-5 text-center border">
            <p className="font-semibold">Sales Summary (Last 7 days)</p>
            <h2 className="text-2xl font-bold">345 Units</h2>
            <button> <Link to="/ProductReport" className="text-blue-500 mt-2"> See details</Link></button>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-5 text-center border">
            <p className="font-semibold">Total Revenue (Last month)</p>
            <h2 className="text-2xl font-bold">Rs. 26,500</h2>
            <button><Link to="/FinancialReport" className="text-blue-500 mt-2">See details</Link></button>
          </div>
        </div>

          {/* Revenue Chart */}
        <div className="mt-10 p-10 bg-white p-5 shadow-lg rounded-lg">
          <h2 className="text-lg font-bold mb-3">Revenue (Rs.)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Plants */}
        <div className="p-10 mt-10 bg-gray-100 p-5 rounded-lg shadow-lg mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Top Selling Plants</h2>
            <button> <Link to ="/ProductReport" className="text-blue-500">See details</Link></button>
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
        <div className="p-20 bg-gray-100 p-5 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <button> <Link to="/CustomerReport" className="text-blue-500">See details</Link></button>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Order ID</th>
                <th className="border border-gray-300 p-2">Customer</th>
                <th className="border border-gray-300 p-2">Amount (Rs.)</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="border border-gray-300 p-2">{order.id}</td>
                  <td className="border border-gray-300 p-2">{order.customer}</td>
                  <td className="border border-gray-300 p-2">{order.amount}</td>
                  <td className={`border border-gray-300 p-2 font-semibold ${order.status === "Complete" ? "text-green-600" : order.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SalesManagerDashboard;


