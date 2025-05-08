// frontend\src\dashboards\SalesReports\FinancialReport.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SalesManagerNavbar from "../../components/SalesManagerNavbar";
import SalesManagerSidebar from "../../components/SalesManagerSidebar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const incstatement = [
  { date: "01/03/2025", description: "Balance B/F", income: "12000", expense: "-", balance: 12000 },
  { date: "02/03/2025", description: "Order 001", income: "5000", expense: "-", balance: 12500 },
  { date: "03/03/2025", description: "Electricity Bill", income: "-", expense: "8000", balance: 4500 },
  { date: "04/03/2025", description: "Order 002", income: "7000", expense: "-", balance: 11000 },
  { date: "31/03/2025", description: "Balance C/D", income: "11000", expense: "-", balance: 11000 },
];

const FinancialReport = () => {
  const [totalFuelCost, setTotalFuelCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the total fuel cost for the last 7 days
  useEffect(() => {
    const fetchTotalFuelCost = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("API_URL being used:", API_URL);
        console.log("Fetching total fuel cost from:", `${API_URL}/api/sales/total-fuel-cost-last-7-days`);
        const response = await fetch(`${API_URL}/api/sales/total-fuel-cost-last-7-days`, {
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
          throw new Error(errorData || "Failed to fetch total fuel cost");
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setTotalFuelCost(data.totalFuelCost);
      } catch (error) {
        console.error("Fetch error details:", error);
        setError(`Failed to connect to the server: ${error.message}. Please check if the backend is running.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalFuelCost();
  }, []);

  return (
    <div className="flex h-screen bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <div className="flex justify-between items-center mb-6 mt-6">
          <h1 className="text-3xl font-bold text-green-600">Financial Report</h1>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
            Generate Report
          </button>
        </div>

        {/* Income Statement */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-bold mb-4">Income Statement</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3">Date</th>
                  <th className="border border-gray-300 p-3">Description</th>
                  <th className="border border-gray-300 p-3">Income (Rs.)</th>
                  <th className="border border-gray-300 p-3">Expense (Rs.)</th>
                  <th className="border border-gray-300 p-3">Total Balance (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {incstatement.map((order, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-3">{order.date}</td>
                    <td className="border border-gray-300 p-3">{order.description}</td>
                    <td className="border border-gray-300 p-3">{order.income}</td>
                    <td className="border border-gray-300 p-3">{order.expense}</td>
                    <td className="border border-gray-300 p-3">{order.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <p className="font-bold text-lg mb-4">Total Revenue and Expenses Summary (Last 7 days)</p>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold">Total Income</p>
              <p className="text-sm font-semibold">Rs.28000</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold">Total Expenses</p>
              <p className="text-sm font-semibold">Rs.15000</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold">Discounts</p>
              <p className="text-sm font-semibold">Rs.8000</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Tax Payable</p>
              <p className="text-sm font-semibold">Rs.5000</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-center items-center">
            <p className="font-semibold text-lg mb-2">Total Fuel Cost (Last 7 days)</p>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <h2 className="text-2xl font-bold text-blue-600">{totalFuelCost}</h2>
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

export default FinancialReport;