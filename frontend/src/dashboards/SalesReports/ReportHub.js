// frontend\src\dashboards\SalesReports\ReportHub.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SalesManagerNavbar from "../../components/SalesManagerNavbar";
import SalesManagerSidebar from "../../components/SalesManagerSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ReportHub = () => {
  const [reportType, setReportType] = useState("financial");
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState({}); // For aggregates/summary
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for date range (for Financial, Customer, Product reports)
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Default to 7 days ago
  );
  const [endDate, setEndDate] = useState(new Date()); // Default to today

  // State for month and year (for Payroll report)
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

  // Fetch report data when the report type, month, year, or date range changes
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      setReportData([]); // Reset data when switching report types
      setSummaryData({}); // Reset summary data

      try {
        let endpoint;
        let url;
        switch (reportType) {
          case "financial":
            endpoint = "financial-report";
            url = `${API_URL}/api/sales/${endpoint}?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`;
            break;
          case "customer":
            endpoint = "customer-report";
            url = `${API_URL}/api/sales/${endpoint}?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`;
            break;
          case "payroll":
            endpoint = "payroll-report";
            url = `${API_URL}/api/sales/${endpoint}?month=${month}&year=${year}`;
            break;
          case "product":
            endpoint = "product-performance-report";
            url = `${API_URL}/api/sales/${endpoint}?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`;
            break;
          default:
            endpoint = "financial-report";
            url = `${API_URL}/api/sales/${endpoint}?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          let dataArray = [];
          let summary = {};

          switch (reportType) {
            case "financial":
              dataArray = Array.isArray(data.transactions) ? data.transactions : [];
              summary = data.aggregates || {};
              break;
            case "customer":
              dataArray = Array.isArray(data.topCustomers) ? data.topCustomers : [];
              summary = data.summary || {};
              break;
            case "payroll":
              dataArray = Array.isArray(data.payroll) ? data.payroll : [];
              summary = { totalPayroll: data.totalPayroll || 0 };
              break;
            case "product":
              dataArray = Array.isArray(data.products) ? data.products : [];
              summary = data.aggregates || {};
              break;
            default:
              dataArray = [];
              summary = {};
          }

          setReportData(dataArray);
          setSummaryData(summary);
        } else {
          setError(data.error || `Failed to fetch ${reportType} report`);
        }
      } catch (error) {
        setError("Failed to connect to the server. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, month, year, startDate, endDate]);

  // Export to CSV
  const exportToCSV = () => {
    if (!Array.isArray(reportData) || reportData.length === 0) {
      alert("No data available to export.");
      return;
    }

    let headers, rows, summaryRows = [];
    switch (reportType) {
      case "financial":
        headers = ["Date", "Description", "Income (Rs.)", "Expense (Rs.)", "Balance (Rs.)"];
        rows = reportData.map((entry) => [
          entry.date || "-",
          `"${entry.description || "-"}"`,
          entry.income || "0",
          entry.expense || "0",
          entry.balance || "0",
        ]);
        summaryRows = [
          ["Summary", "", "", "", ""],
          ["Total Income (Rs.)", "", summaryData.totalIncome || "0", "", ""],
          ["Total Expense (Rs.)", "", summaryData.totalExpense || "0", "", ""],
          ["Tax Payable (Rs.)", "", summaryData.totalTaxPayable || "0", "", ""],
          ["Net Profit (Rs.)", "", summaryData.netProfit || "0", "", ""],
          ["Final Balance (Rs.)", "", summaryData.finalBalance || "0", "", ""],
        ];
        break;
      case "customer":
        headers = ["Customer Name", "Total Purchases (Rs.)"];
        rows = reportData.map((entry) => [
          `"${entry.name || "-"}"`,
          entry.totalPurchases || "0",
        ]);
        summaryRows = [
          ["Summary", ""],
          ["New Customers", summaryData.newCustomers || "0"],
          ["Total Purchases (Rs.)", summaryData.totalPurchases || "0"],
        ];
        break;
      case "payroll":
        headers = [
          "Sr. No",
          "Name of Employee",
          "Designation",
          "Basic (Rs.)",
          "Allowances / OverTime (Rs.)",
          "Deductions (Rs.)",
          "Net Salary (Rs.)",
        ];
        rows = reportData.map((entry, index) => [
          index + 1,
          `"${entry.employeeName || "-"}"`,
          `"${entry.designation || "-"}"`,
          entry.basicSalary || "0",
          entry.allowances || "0",
          entry.deductions || "0",
          entry.netSalary || "0",
        ]);
        summaryRows = [
          ["Summary", "", "", "", "", "", ""],
          ["Total Payroll (Rs.)", "", "", "", "", "", summaryData.totalPayroll || "0"],
        ];
        break;
      case "product":
        headers = ["Product Name", "Units Sold", "Revenue (Rs.)"];
        rows = reportData.map((entry) => [
          `"${entry.name || "-"}"`,
          entry.unitsSold || "0",
          entry.revenue || "0",
        ]);
        summaryRows = [
          ["Summary", "", ""],
          ["Total Units Sold", summaryData.totalUnitsSold || "0", ""],
          ["Total Revenue (Rs.)", summaryData.totalRevenue || "0", ""],
        ];
        break;
      default:
        headers = [];
        rows = [];
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "", // Empty line for separation
      ...summaryRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const suffix = reportType === "payroll" ? `${month}_${year}` : `${startDate.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}`;
    link.setAttribute("download", `${reportType}_report_${suffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!Array.isArray(reportData) || reportData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();
    let columns, rows, title, summaryText = [];

    switch (reportType) {
      case "financial":
        title = `Financial Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`;
        columns = ["Date", "Description", "Income (Rs.)", "Expense (Rs.)", "Balance (Rs.)"];
        rows = reportData.map((entry) => [
          entry.date || "-",
          entry.description || "-",
          entry.income || "0",
          entry.expense || "0",
          entry.balance || "0",
        ]);
        summaryText = [
          "Summary:",
          `Total Income: Rs. ${summaryData.totalIncome || "0"}`,
          `Total Expense: Rs. ${summaryData.totalExpense || "0"}`,
          `Tax Payable: Rs. ${summaryData.totalTaxPayable || "0"}`,
          `Net Profit: Rs. ${summaryData.netProfit || "0"}`,
          `Final Balance: Rs. ${summaryData.finalBalance || "0"}`,
        ];
        break;
      case "customer":
        title = `Customer Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`;
        columns = ["Customer Name", "Total Purchases (Rs.)"];
        rows = reportData.map((entry) => [
          entry.name || "-",
          entry.totalPurchases || "0",
        ]);
        summaryText = [
          "Summary:",
          `New Customers: ${summaryData.newCustomers || "0"}`,
          `Total Purchases: Rs. ${summaryData.totalPurchases || "0"}`,
        ];
        break;
      case "payroll":
        const monthName = new Date(0, month - 1).toLocaleString("default", { month: "long" });
        title = `Salary Payroll Report for ${monthName} ${year}`;
        columns = [
          "Sr. No",
          "Name of Employee",
          "Designation",
          "Basic (Rs.)",
          "Allowances / OverTime (Rs.)",
          "Deductions (Rs.)",
          "Net Salary (Rs.)",
        ];
        rows = reportData.map((entry, index) => [
          index + 1,
          entry.employeeName || "-",
          entry.designation || "-",
          entry.basicSalary || "0",
          entry.allowances || "0",
          entry.deductions || "0",
          entry.netSalary || "0",
        ]);
        summaryText = [
          "Summary:",
          `Total Payroll: Rs. ${summaryData.totalPayroll || "0"}`,
        ];
        break;
      case "product":
        title = `Product Performance Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`;
        columns = ["Product Name", "Units Sold", "Revenue (Rs.)"];
        rows = reportData.map((entry) => [
          entry.name || "-",
          entry.unitsSold || "0",
          entry.revenue || "0",
        ]);
        summaryText = [
          "Summary:",
          `Total Units Sold: ${summaryData.totalUnitsSold || "0"}`,
          `Total Revenue: Rs. ${summaryData.totalRevenue || "0"}`,
        ];
        break;
      default:
        title = "Report";
        columns = [];
        rows = [];
    }

    doc.setFontSize(16);
    doc.text(title, 14, 20);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      margin: { top: 30 },
    });

    // Add summary data below the table
    const finalY = doc.lastAutoTable.finalY || 30;
    doc.setFontSize(12);
    summaryText.forEach((line, index) => {
      doc.text(line, 14, finalY + 10 + (index * 10));
    });

    const suffix = reportType === "payroll" ? `${month}_${year}` : `${startDate.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}`;
    doc.save(`${reportType}_report_${suffix}.pdf`);
  };

  return (
    <div className="flex h-parent bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <h1 className="text-3xl font-bold text-green-600 mb-6 mt-6">Reports Hub</h1>
        <div className="mb-6">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center">
                <label className="mr-4 font-semibold whitespace-nowrap">Select Report Type:</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="p-2 border rounded bg-white h-10"
                >
                  <option value="financial">Financial Report</option>
                  <option value="customer">Customer Report</option>
                  <option value="payroll">Salary Payroll</option>
                  <option value="product">Product Performance</option>
                </select>
              </div>

              {/* Date Range Selectors for Financial, Customer, and Product Reports */}
              {["financial", "customer", "product"].includes(reportType) && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <label className="text-sm font-semibold mr-2 whitespace-nowrap">Start Date:</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="border border-gray-300 rounded p-2 h-10"
                      maxDate={endDate}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="text-sm font-semibold mr-2 whitespace-nowrap">End Date:</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="border border-gray-300 rounded p-2 h-10"
                      minDate={startDate}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              )}

              {/* Month and Year Selectors for Payroll Report */}
              {reportType === "payroll" && (
                <div className="flex items-center gap-2">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="p-2 border rounded bg-white h-10"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="p-2 border rounded bg-white h-10"
                  >
                    {[...Array(5)].map((_, i) => {
                      const y = new Date().getFullYear() - 2 + i;
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
              >
                Export to CSV
              </button>
              <button
                onClick={exportToPDF}
                className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600"
              >
                Export to PDF
              </button>
            </div>
          </div>
        </div>

        {/* Render the selected report data in a table */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-4">
            {reportType === "financial" && `Financial Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`}
            {reportType === "customer" && `Customer Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`}
            {reportType === "payroll" &&
              `Salary Payroll Report for ${new Date(0, month - 1).toLocaleString("default", { month: "long" })} ${year}`}
            {reportType === "product" && `Product Performance Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`}
          </h2>

          {loading ? (
            <p className="text-center p-4 text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center p-4">{error}</p>
          ) : !Array.isArray(reportData) || reportData.length === 0 ? (
            <p className="text-center p-4 text-gray-600">No data available for this report.</p>
          ) : (
            <>
              {/* Report Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      {reportType === "financial" && (
                        <>
                          <th className="border border-gray-300 p-3">Date</th>
                          <th className="border border-gray-300 p-3">Description</th>
                          <th className="border border-gray-300 p-3">Income (Rs.)</th>
                          <th className="border border-gray-300 p-3">Expense (Rs.)</th>
                          <th className="border border-gray-300 p-3">Balance (Rs.)</th>
                        </>
                      )}
                      {reportType === "customer" && (
                        <>
                          <th className="border border-gray-300 p-3">Customer Name</th>
                          <th className="border border-gray-300 p-3">Total Purchases (Rs.)</th>
                        </>
                      )}
                      {reportType === "payroll" && (
                        <>
                          <th className="border border-gray-300 p-3">Sr. No</th>
                          <th className="border border-gray-300 p-3">Name of Employee</th>
                          <th className="border border-gray-300 p-3">Designation</th>
                          <th className="border border-gray-300 p-3">Basic (Rs.)</th>
                          <th className="border border-gray-300 p-3">Allowances / OverTime (Rs.)</th>
                          <th className="border border-gray-300 p-3">Deductions (Rs.)</th>
                          <th className="border border-gray-300 p-3">Net Salary (Rs.)</th>
                        </>
                      )}
                      {reportType === "product" && (
                        <>
                          <th className="border border-gray-300 p-3">Product Name</th>
                          <th className="border border-gray-300 p-3">Units Sold</th>
                          <th className="border border-gray-300 p-3">Revenue (Rs.)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {reportType === "financial" &&
                      reportData.map((entry, index) => (
                        <tr key={index} className="text-center">
                          <td className="border border-gray-300 p-3">{entry.date || "-"}</td>
                          <td className="border border-gray-300 p-3">{entry.description || "-"}</td>
                          <td className="border border-gray-300 p-3">{entry.income || "0"}</td>
                          <td className="border border-gray-300 p-3">{entry.expense || "0"}</td>
                          <td className="border border-gray-300 p-3">{entry.balance || "0"}</td>
                        </tr>
                      ))}
                    {reportType === "customer" &&
                      reportData.map((entry, index) => (
                        <tr key={index} className="text-center">
                          <td className="border border-gray-300 p-3">{entry.name || "-"}</td>
                          <td className="border border-gray-300 p-3">{entry.totalPurchases || "0"}</td>
                        </tr>
                      ))}
                    {reportType === "payroll" &&
                      reportData.map((entry, index) => (
                        <tr key={entry._id || index} className="text-center">
                          <td className="border border-gray-300 p-3">{index + 1}</td>
                          <td className="border border-gray-300 p-3">{entry.employeeName || "-"}</td>
                          <td className="border border-gray-300 p-3">{entry.designation || "-"}</td>
                          <td className="border border-gray-300 p-3">{entry.basicSalary || "0"}</td>
                          <td className="border border-gray-300 p-3">{entry.allowances || "0"}</td>
                          <td className="border border-gray-300 p-3">{entry.deductions || "0"}</td>
                          <td className="border border-gray-300 p-3">{entry.netSalary || "0"}</td>
                        </tr>
                      ))}
                    {reportType === "product" &&
                      reportData.map((entry, index) => (
                        <tr key={entry._id || index} className="text-center">
                          <td className="border border-gray-300 p-3">{entry.name || "-"}</td>
                          <td className="border border-gray-300 p-3">{entry.unitsSold || "0"}</td>
                          <td className="border border-gray-300 p-3">{entry.revenue || "0"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Summary</h3>
                {reportType === "financial" && (
                  <div className="text-sm">
                    <p>Total Income: Rs. {summaryData.totalIncome || "0"}</p>
                    <p>Total Expense: Rs. {summaryData.totalExpense || "0"}</p>
                    <p>Tax Payable: Rs. {summaryData.totalTaxPayable || "0"}</p>
                    <p>Net Profit: Rs. {summaryData.netProfit || "0"}</p>
                    <p>Final Balance: Rs. {summaryData.finalBalance || "0"}</p>
                  </div>
                )}
                {reportType === "customer" && (
                  <div className="text-sm">
                    <p>New Customers: {summaryData.newCustomers || "0"}</p>
                    <p>Total Purchases: Rs. {summaryData.totalPurchases || "0"}</p>
                  </div>
                )}
                {reportType === "payroll" && (
                  <div className="text-sm">
                    <p>Total Payroll: Rs. {summaryData.totalPayroll || "0"}</p>
                  </div>
                )}
                {reportType === "product" && (
                  <div className="text-sm">
                    <p>Total Units Sold: {summaryData.totalUnitsSold || "0"}</p>
                    <p>Total Revenue: Rs. ${summaryData.totalRevenue || "0"}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportHub;