// frontend\src\dashboards\SalesReports\FinancialReport.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SalesManagerNavbar from "../../components/SalesManagerNavbar";
import SalesManagerSidebar from "../../components/SalesManagerSidebar";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FinancialReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [aggregates, setAggregates] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalTaxPayable: 0,
    netProfit: 0, // Added netProfit
    finalBalance: 0,
  });
  const [totalFuelCost, setTotalFuelCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Default to 7 days ago
  );
  const [endDate, setEndDate] = useState(new Date()); // Default to today

  // Fetch financial report data (Income Statement and Aggregates)
  const fetchFinancialReport = async () => {
    setLoading(true);
    setError(null);

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];
    const url = `${API_URL}/api/sales/financial-report?startDate=${startDateStr}&endDate=${endDateStr}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to fetch financial report");
      }

      const data = await response.json();
      console.log("API Response:", data);
      setTransactions(data.transactions || []);
      setAggregates(data.aggregates || {
        totalIncome: 0,
        totalExpense: 0,
        totalTaxPayable: 0,
        netProfit: 0, // Added netProfit
        finalBalance: 0,
      });
    } catch (error) {
      setError(`Failed to connect to the server: ${error.message}. Please check if the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the total fuel cost for the selected date range
  const fetchTotalFuelCost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/sales/total-fuel-cost-last-7-days`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to fetch total fuel cost");
      }

      const data = await response.json();
      setTotalFuelCost(data.totalFuelCost || 0);
    } catch (error) {
      setError(`Failed to connect to the server: ${error.message}. Please check if the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when startDate or endDate changes
  useEffect(() => {
    fetchFinancialReport();
    fetchTotalFuelCost();
  }, [startDate, endDate]); // Trigger fetch when dates change

  // Handle polling for updates (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchFinancialReport();
      fetchTotalFuelCost();
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId);
  }, [startDate, endDate]); // Ensure polling also respects date changes

  return (
    <div className="flex h-parent bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <div className="flex justify-between items-center mb-6 mt-6">
          <h1 className="text-3xl font-bold text-green-600">Financial Report</h1>
          <div className="flex space-x-4">
            <div>
              <label className="text-sm font-semibold mr-2">Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border border-gray-300 rounded p-2"
                maxDate={endDate} // Prevent start date from being after end date
              />
            </div>
            <div>
              <label className="text-sm font-semibold mr-2">End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border border-gray-300 rounded p-2"
                minDate={startDate} // Prevent end date from being before start date
                maxDate={new Date()} // Prevent future dates
              />
            </div>
          </div>
        </div>

        {/* Income Statement */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-bold mb-4">Income Statement</h2>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-gray-500 text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : transactions.length > 0 ? (
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
                  {transactions.map((order, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 p-3">{order.date}</td>
                      <td className="border border-gray-300 p-3">{order.description}</td>
                      <td className="border border-gray-300 p-3">{order.income === 0 ? "-" : order.income}</td>
                      <td className="border border-gray-300 p-3">{order.expense === 0 ? "-" : order.expense}</td>
                      <td className="border border-gray-300 p-3">{order.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 text-center">No financial transactions available for the selected period.</p>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <p className="font-bold text-lg mb-4">Total Revenue and Expenses Summary</p>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold">Total Income</p>
                  <p className="text-sm font-semibold">Rs. {aggregates.totalIncome}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold">Total Expenses</p>
                  <p className="text-sm font-semibold">Rs. {aggregates.totalExpense}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold">Tax Payable</p>
                  <p className="text-sm font-semibold">Rs. {aggregates.totalTaxPayable}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">Net Profit</p>
                  <p className="text-sm font-semibold">Rs. {aggregates.netProfit}</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-center items-center">
            <p className="font-semibold text-lg mb-2">Total Fuel Cost</p>
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