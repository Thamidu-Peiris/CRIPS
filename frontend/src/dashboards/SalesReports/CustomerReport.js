// CRISPS\frontend\src\dashboards\SalesReports\CustomerReport.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// "Favorite Payment Method" pie chart static data
const paymentMethodData = [
  { name: "Credit Card", value: 41 },
  { name: "Bank", value: 41 },
  { name: "PayPal", value: 18 },
];

// "Top Customers" table static data
const topCustomersData = [
  { name: "A", totalPurchase: 8600 },
  { name: "B", totalPurchase: 6500 },
  { name: "C", totalPurchase: 5000 },
  { name: "D", totalPurchase: 4350 },
  { name: "E", totalPurchase: 3800 },
];

const COLORS = ["#0088FE", "#FF4560", "#FFBB28"];

const CustomerReport = () => {
  const [newCustomersCount, setNewCustomersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the number of new customers for the last 7 days
  useEffect(() => {
    const fetchNewCustomersCount = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("API_URL being used:", API_URL);
        console.log("Fetching new customers count from:", `${API_URL}/api/sales/new-customers-last-seven-days`);
        const response = await fetch(`${API_URL}/api/sales/new-customers-last-day`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorData = await response.text();
          console.log("Error response body:", errorData);
          throw new Error(errorData || "Failed to fetch new customers count");
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setNewCustomersCount(data.newCustomersCount);
      } catch (error) {
        console.error("Fetch error details:", error);
        setError(`Failed to connect to the server: ${error.message}. Please check if the backend is running.`);
      } finally {
        setLoading(false);
      }
    };

    fetchNewCustomersCount();
  }, []);

  return (
    <div className="flex h-parent bg-gray-100">
      {/* Sidebar */}
      <div className="w-[275px] bg-gray-300 p-5">
        <h2 className="text-xl font-bold mb-5">Side Bar</h2>
        <ul className="space-y-5">
          <li>
            <Link to="/sales-manager-dashboard" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">
              🏠 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/FinancialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">
              📉 Financial Report
            </Link>
          </li>
          <li>
            <Link to="/ProductReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">
              📦 Products Report
            </Link>
          </li>
          <li>
            <Link to="/CustomerReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">
              👥 Customer Reports
            </Link>
          </li>
          <li>
            <Link to="/SalarySheet" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">
              💰 Employee Salary Sheet
            </Link>
          </li>
          <li>
            <Link to="/ReportHub" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">
              📊 Reports Hub
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">
              ⚙ Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-6 text-center relative">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold text-green-600">Customer Statistics Report</h1>
          <button className="bg-green-500 px-4 py-2 rounded-full">Generate Report</button>
        </div>

        {/* Charts and Tables Section */}
        <div className="flex justify-between gap-1">
          {/* Favorite Payment Method Pie Chart */}
          <div className="bg-white shadow-lg rounded-lg p-1 ml-20 text-center border w-[500px]">
            <h2 className="text-lg font-bold mb-4 mt-2">Favorite Payment Method</h2>
            <div className="flex justify-center">
              <PieChart width={350} height={350}>
                <Pie
                  data={paymentMethodData}
                  cx={160}
                  cy={160}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                  labelLine={true}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>

          {/* Top Customers Table */}
          <div className="bg-white shadow-lg rounded-lg p-5 border mr-20 w-[400px]">
            <h2 className="text-lg font-bold mb-4 text-center">Top Customers</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 text-center">Name</th>
                  <th className="p-2 text-center">Total Purchase Price (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {topCustomersData.map((customer, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 text-center">{customer.name}</td>
                    <td className="p-2 text-center">{customer.totalPurchase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex justify-between items-center gap-10 mt-8 mr-20 ml-20">
          <div className="bg-white shadow-lg rounded-lg p-5 text-center border w-[300px]">
            <p className="font-semibold">New Customers (Last 7 Days)</p>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <h2 className="text-2xl font-bold">{newCustomersCount}</h2>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-5 text-center border w-[300px]">
            <p className="font-semibold">Total Purchases (Last 7 days)</p>
            <h2 className="text-2xl font-bold">15000</h2>
          </div>

          {/* Export Report */}
          <div className="w-[385px] h-[200px] p-5 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
            <p className="font-bold mb-2">Export File</p>
            <h2 className="text-sm font-semibold mb-2">Download as CSV SpreadSheet or a PDF</h2>
            <Link to="/ReportHub" className="bg-green-500 text-black px-4 py-2 rounded-full mr-2">
              Go to Report Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReport;