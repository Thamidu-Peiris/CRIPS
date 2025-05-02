// frontend\src\dashboards\SalesReports\FinancialReport.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
    <div className="flex h-screen bg-gray-100">
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
      <div className="w-4/5 p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Financial Report</h1>
          <button className="bg-green-500 px-4 py-2 rounded-full">Generate Report</button>
        </div>

        {/* Income Statement */}
        <div className="p-20 bg-gray-100 p-5 mt-10 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Income Statement</h2>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Income (Rs.)</th>
                <th className="border border-gray-300 p-2">Expense (Rs.)</th>
                <th className="border border-gray-300 p-2">Total Balance (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {incstatement.map((order) => (
                <tr className="text-center">
                  <td className="border border-gray-300 p-2">{order.date}</td>
                  <td className="border border-gray-300 p-2">{order.description}</td>
                  <td className="border border-gray-300 p-2">{order.income}</td>
                  <td className="border border-gray-300 p-2">{order.expense}</td>
                  <td className="border border-gray-300 p-2">{order.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="mt-10 flex justify-left gap-20">
          <div className="bg-white shadow-lg rounded-lg p-4 text-center border h-[210px] w-[305px]">
            <p className="font-bold mb-2">Total Revenue and Expenses Summary (Last 7 days)</p>
            <div className="flex justify-between mb-2">
              <p className="text-s font-semibold text-right">Total Income</p>
              <p className="text-s font-semibold text-right">Rs.28000</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-s font-semibold text-right">Total Expenses</p>
              <p className="text-s font-semibold text-right">Rs.15000</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-s font-semibold text-right">Discounts</p>
              <p className="text-s font-semibold text-right">Rs.8000</p>
            </div>
            <div className="flex justify-between">
              <p className="text-s font-semibold text-right">Tax Payable</p>
              <p className="text-s font-semibold text-right">Rs.5000</p>
            </div>
          </div>

          {/* Fuel Cost */}
          <div className="w-[385px] h-[200px] p-5 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
            <p className="font-semibold">Total Fuel Cost (Last 7 days)</p>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <h2 className="text-2xl font-bold">{totalFuelCost}</h2>
            )}
          </div>

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

export default FinancialReport;