// CustomerReport.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import SalesManagerNavbar from "../../components/SalesManagerNavbar";
import SalesManagerSidebar from "../../components/SalesManagerSidebar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const COLORS = ["#0088FE", "#FF4560", "#FFBB28"];

const CustomerReport = () => {
  const [orderSizeDistribution, setOrderSizeDistribution] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [newCustomersCount, setNewCustomersCount] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomerReport = async () => {
    setLoading(true);
    setError(null);

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const url = `${API_URL}/api/sales/customer-report?startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to fetch customer report");
      }

      const data = await response.json();

      console.log("Order Size Distribution received in frontend:", data.orderSizeDistribution);

      setOrderSizeDistribution(data.orderSizeDistribution || []);
      setTopCustomers(data.topCustomers || []);
      setNewCustomersCount(data.summary?.newCustomers || 0);
      setTotalPurchases(data.summary?.totalPurchases || 0);
    } catch (error) {
      setError(`Failed to connect to the server: ${error.message}. Please check if the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerReport();
    const intervalId = setInterval(fetchCustomerReport, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Calculate total for percentages
  const totalOrders = orderSizeDistribution.reduce((sum, entry) => sum + entry.value, 0);
  const pieChartData = orderSizeDistribution.map(entry => ({
    name: entry.name,
    value: entry.value,
    percent: totalOrders > 0 ? (entry.value / totalOrders) * 100 : 0,
  }));

  console.log("Pie Chart Data:", pieChartData);

  // Custom label renderer to position labels outside the pie chart with lines
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position labels 30px outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${pieChartData[index].name} (${percent.toFixed(2)}%)`}
      </text>
    );
  };

  return (
    <div className="flex h-parent bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <div className="flex justify-between items-center mb-6 mt-6">
          <h1 className="text-3xl font-bold text-green-600">Customer Statistics Report</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Size Distribution Pie Chart */}
          <div className="bg-white shadow-md rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold mb-4">Order Size Distribution</h2>
            <div className="flex justify-center">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : orderSizeDistribution.length > 0 && totalOrders > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                      labelLine={true}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} orders`, props.payload.name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-600">No order size data available for the selected period.</p>
              )}
            </div>
          </div>

          {/* Top Customers Table */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-center">Top Customers</h2>
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-gray-500 text-center">Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : topCustomers.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-3 text-center">Name</th>
                      <th className="border border-gray-300 p-3 text-center">Total Purchase Price (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer, index) => (
                      <tr key={index} className="border-t">
                        <td className="border border-gray-300 p-3 text-center">{customer.name || 'Unknown'}</td>
                        <td className="border border-gray-300 p-3 text-center">{customer.totalPurchases || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 text-center">No top customers available for the selected period.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">New Customers (Last 7 Days)</p>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <h2 className="text-2xl font-bold text-blue-600">{newCustomersCount}</h2>
            )}
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Total Purchases (Last 7 days)</p>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <h2 className="text-2xl font-bold text-blue-600">{totalPurchases}</h2>
            )}
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-center items-center">
            <p className="font-bold text-lg mb-2">Export File</p>
            <h2 className="text-sm font-semibold mb-4 text-center">Download as CSV SpreadSheet or a PDF</h2>
            <Link
              to="/ReportHub"
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
            >
              Go to Report Hub
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerReport;