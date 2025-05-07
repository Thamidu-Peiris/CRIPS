import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import SalesManagerNavbar from "../../components/SalesManagerNavbar";
import SalesManagerSidebar from "../../components/SalesManagerSidebar";

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
    <div className="flex h-parent bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <div className="flex justify-between items-center mb-6 mt-6">
          <h1 className="text-3xl font-bold text-green-600">Customer Statistics Report</h1>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
            Generate Report
          </button>
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Favorite Payment Method Pie Chart */}
          <div className="bg-white shadow-md rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold mb-4">Favorite Payment Method</h2>
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
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-center">Top Customers</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-3 text-center">Name</th>
                    <th className="border border-gray-300 p-3 text-center">Total Purchase Price (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomersData.map((customer, index) => (
                    <tr key={index} className="border-t">
                      <td className="border border-gray-300 p-3 text-center">{customer.name}</td>
                      <td className="border border-gray-300 p-3 text-center">{customer.totalPurchase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
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
            <h2 className="text-2xl font-bold text-blue-600">15000</h2>
          </div>

          {/* Export Report */}
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