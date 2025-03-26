// CRISPS\frontend\src\dashboards\SalesReports\ReportHub.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf"; // For PDF export
import autoTable from "jspdf-autotable"; // Import autoTable directly

const ReportHub = () => {
  const [reportType, setReportType] = useState("financial");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for month and year (for payroll report)
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

  // Fetch report data when the report type, month, or year changes
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      setReportData([]); // Reset data when switching report types

      try {
        let endpoint;
        let url;
        switch (reportType) {
          case "financial":
            endpoint = "financial-report";
            url = `http://localhost:5000/api/sales/${endpoint}`;
            break;
          case "customer":
            endpoint = "customer-report";
            url = `http://localhost:5000/api/sales/${endpoint}`;
            break;
          case "payroll":
            endpoint = "payroll-report";
            url = `http://localhost:5000/api/sales/${endpoint}?month=${month}&year=${year}`;
            break;
          case "product":
            endpoint = "product-performance-report";
            url = `http://localhost:5000/api/sales/${endpoint}`;
            break;
          default:
            endpoint = "financial-report";
            url = `http://localhost:5000/api/sales/${endpoint}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {

          console.log(`Response data for ${reportType}:`, data);
         // let dataArray;
          if (reportType === "payroll") {
            // Extract the payroll array from the response
            dataArray = Array.isArray(data.payroll) ? data.payroll : [];
          } else if (reportType === "financial") {
            // Extract the transactions array from the financial report response
            dataArray = Array.isArray(data.transactions) ? data.transactions : [];
          } else if (reportType === "customer") {
            // Extract the topCustomers array from the customer report response
            dataArray = Array.isArray(data.topCustomers) ? data.topCustomers : [];
          } else if (reportType === "product") {
            // Extract the products array from the product report response
            dataArray = Array.isArray(data.products) ? data.products : [];
          } else {
            dataArray = Array.isArray(data) ? data : [];
          }

          // Ensure data is an array; if not, convert it to an array or set to empty array
          console.log(`Response data for ${reportType}:`, data); // Debug log
          const dataArray = Array.isArray(data) ? data : [];
          setReportData(dataArray);
        } else {
          console.error(`Error fetching ${reportType} report:`, data.error);
          setError(data.error || `Failed to fetch ${reportType} report`);
        }
      } catch (error) {
        console.error(`Error fetching ${reportType} report:`, error);
        setError("Failed to connect to the server. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, month, year]); // Add month and year as dependencies

  // Export to CSV (Manual CSV Generation)
  const exportToCSV = () => {
    if (!Array.isArray(reportData) || reportData.length === 0) {
      alert("No data available to export.");
      return;
    }

    let headers, rows;
    switch (reportType) {
      case "financial":
        headers = ["Date", "Type", "Amount (Rs.)", "Description"];
        rows = reportData.map((entry) => [
          entry.date || "-",
          entry.type || "-",
          entry.amount || "-",
          `"${entry.description || "-"}"`, // Wrap in quotes to handle commas
        ]);
        break;
      case "customer":
        headers = ["Customer Name", "Total Purchases", "Total Amount (Rs.)"];
        rows = reportData.map((entry) => [
          `"${entry.customerName || "-"}"`,
          entry.totalPurchases || "-",
          entry.totalAmount || "-",
        ]);
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
          entry.basicSalary || "-",
          entry.allowances || "-",
          entry.deductions || "-",
          entry.netSalary || "-",
        ]);
        break;
      case "product":
        headers = ["Product Name", "Units Sold", "Total Revenue (Rs.)"];
        rows = reportData.map((entry) => [
          `"${entry.productName || "-"}"`,
          entry.unitsSold || "-",
          entry.totalRevenue || "-",
        ]);
        break;
      default:
        headers = [];
        rows = [];
    }

    // Combine headers and rows into a CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${month}_${year}.csv`); // Include month and year in filename for payroll
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
    let columns, rows, title;

    switch (reportType) {
      case "financial":
        title = "Financial Report";
        columns = ["Date", "Type", "Amount (Rs.)", "Description"];
        rows = reportData.map((entry) => [
          entry.date || "-",
          entry.type || "-",
          entry.amount || "-",
          entry.description || "-",
        ]);
        break;
      case "customer":
        title = "Customer Report";
        columns = ["Customer Name", "Total Purchases", "Total Amount (Rs.)"];
        rows = reportData.map((entry) => [
          entry.customerName || "-",
          entry.totalPurchases || "-",
          entry.totalAmount || "-",
        ]);
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
          entry.basicSalary || "-",
          entry.allowances || "-",
          entry.deductions || "-",
          entry.netSalary || "-",
        ]);
        break;
      case "product":
        title = "Product Performance Report";
        columns = ["Product Name", "Units Sold", "Total Revenue (Rs.)"];
        rows = reportData.map((entry) => [
          entry.productName || "-",
          entry.unitsSold || "-",
          entry.totalRevenue || "-",
        ]);
        break;
      default:
        title = "Report";
        columns = [];
        rows = [];
    }

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Use autoTable to generate the table
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      margin: { top: 30 },
    });

    // Save the PDF
    doc.save(`${reportType}_report_${month}_${year}.pdf`); // Include month and year in filename for payroll
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[275px] bg-gray-300 p-5">
        <h2 className="text-xl font-bold mb-5">Side Bar</h2>
        <ul className="space-y-5">
          <li><Link to="/sales-manager-dashboard" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">🏠 Dashboard </Link></li>
          <li><Link to="/FinancialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📉 Financial Report </Link> </li>
          <li><Link to="/ProductReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📦 Products Report  </Link> </li>
          <li><Link to="/CustomerReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">👥 Customer Reports </Link></li>
          <li><Link to="/SalarySheet" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">💰 Employee Salary Sheet </Link> </li>
          <li><Link to="/ReportHub" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📊 Reports Hub </Link></li>
          <li><Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">⚙ Settings </Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Reports Hub</h1>
        <div className="mb-6 flex items-center">
          <label className="mr-4 font-semibold">Select Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 border rounded mr-4"
          >
            <option value="financial">Financial Report</option>
            <option value="customer">Customer Report</option>
            <option value="payroll">Salary Payroll</option>
            <option value="product">Product Performance</option>
          </select>

          {/* Show month and year selectors only for payroll report */}
          {reportType === "payroll" && (
            <>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="mr-2 p-2 border rounded"
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
                className="mr-2 p-2 border rounded"
              >
                {[...Array(5)].map((_, i) => {
                  const y = new Date().getFullYear() - 2 + i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </>
          )}

          {/* Export Buttons */}
          <button
            onClick={exportToCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2"
          >
            Export to CSV
          </button>
          <button
            onClick={exportToPDF}
            className="bg-purple-500 text-white px-4 py-2 rounded-full"
          >
            Export to PDF
          </button>
        </div>

        {/* Render the selected report data in a table */}
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">
            {reportType === "financial" && "Financial Report"}
            {reportType === "customer" && "Customer Report"}
            {reportType === "payroll" &&
              `Salary Payroll Report for ${new Date(0, month - 1).toLocaleString("default", { month: "long" })} ${year}`}
            {reportType === "product" && "Product Performance Report"}
          </h2>

          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center p-4">{error}</p>
          ) : !Array.isArray(reportData) || reportData.length === 0 ? (
            <p className="text-center p-4">No data available for this report.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {reportType === "financial" && (
                    <>
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Type</th>
                      <th className="border border-gray-300 p-2">Amount (Rs.)</th>
                      <th className="border border-gray-300 p-2">Description</th>
                    </>
                  )}
                  {reportType === "customer" && (
                    <>
                      <th className="border border-gray-300 p-2">Customer Name</th>
                      <th className="border border-gray-300 p-2">Total Purchases</th>
                      <th className="border border-gray-300 p-2">Total Amount (Rs.)</th>
                    </>
                  )}
                  {reportType === "payroll" && (
                    <>
                      <th className="border border-gray-300 p-2">Sr. No</th>
                      <th className="border border-gray-300 p-2">Name of Employee</th>
                      <th className="border border-gray-300 p-2">Designation</th>
                      <th className="border border-gray-300 p-2">Basic (Rs.)</th>
                      <th className="border border-gray-300 p-2">Allowances / OverTime (Rs.)</th>
                      <th className="border border-gray-300 p-2">Deductions (Rs.)</th>
                      <th className="border border-gray-300 p-2">Net Salary (Rs.)</th>
                    </>
                  )}
                  {reportType === "product" && (
                    <>
                      <th className="border border-gray-300 p-2">Product Name</th>
                      <th className="border border-gray-300 p-2">Units Sold</th>
                      <th className="border border-gray-300 p-2">Total Revenue (Rs.)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reportType === "financial" &&
                  reportData.map((entry, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 p-2">{entry.date || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.type || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.amount || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.description || "-"}</td>
                    </tr>
                  ))}
                {reportType === "customer" &&
                  reportData.map((entry, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 p-2">{entry.customerName || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.totalPurchases || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.totalAmount || "-"}</td>
                    </tr>
                  ))}
                {reportType === "payroll" &&
                  reportData.map((entry, index) => (
                    <tr key={entry._id || index} className="text-center">
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{entry.employeeName || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.designation || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.basicSalary || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.allowances || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.deductions || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.netSalary || "-"}</td>
                    </tr>
                  ))}
                {reportType === "product" &&
                  reportData.map((entry, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 p-2">{entry.productName || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.unitsSold || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.totalRevenue || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportHub;