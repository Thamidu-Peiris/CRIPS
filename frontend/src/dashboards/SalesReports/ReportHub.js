// frontend\src\dashboards\SalesReports\ReportHub.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SalesManagerNavbar from "../../components/SalesManagerNavbar";
import SalesManagerSidebar from "../../components/SalesManagerSidebar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
            url = `${API_URL}/api/sales/${endpoint}`;
            break;
          case "customer":
            endpoint = "customer-report";
            url = `${API_URL}/api/sales/${endpoint}`;
            break;
          case "payroll":
            endpoint = "payroll-report";
            url = `${API_URL}/api/sales/${endpoint}?month=${month}&year=${year}`;
            break;
          case "product":
            endpoint = "product-performance-report";
            url = `${API_URL}/api/sales/${endpoint}`;
            break;
          default:
            endpoint = "financial-report";
            url = `${API_URL}/api/sales/${endpoint}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          console.log(`Response data for ${reportType}:`, data);
          let dataArray;
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
  }, [reportType, month, year]);

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
          `"${entry.description || "-"}"`,
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

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${month}_${year}.csv`);
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

    doc.save(`${reportType}_report_${month}_${year}.pdf`);
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <h1 className="text-3xl font-bold text-green-600 mb-6 mt-6">Reports Hub</h1>
        <div className="mb-6 flex items-center flex-wrap gap-4">
          <div className="flex items-center">
            <label className="mr-4 font-semibold">Select Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option value="financial">Financial Report</option>
              <option value="customer">Customer Report</option>
              <option value="payroll">Salary Payroll</option>
              <option value="product">Product Performance</option>
            </select>
          </div>

          {/* Show month and year selectors only for payroll report */}
          {reportType === "payroll" && (
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="p-2 border rounded bg-white"
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
                className="p-2 border rounded bg-white"
              >
                {[...Array(5)].map((_, i) => {
                  const y = new Date().getFullYear() - 2 + i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
          )}

          {/* Export Buttons */}
          <div className="flex gap-2">
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

        {/* Render the selected report data in a table */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-4">
            {reportType === "financial" && "Financial Report"}
            {reportType === "customer" && "Customer Report"}
            {reportType === "payroll" &&
              `Salary Payroll Report for ${new Date(0, month - 1).toLocaleString("default", { month: "long" })} ${year}`}
            {reportType === "product" && "Product Performance Report"}
          </h2>

          {loading ? (
            <p className="text-center p-4 text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center p-4">{error}</p>
          ) : !Array.isArray(reportData) || reportData.length === 0 ? (
            <p className="text-center p-4 text-gray-600">No data available for this report.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    {reportType === "financial" && (
                      <>
                        <th className="border border-gray-300 p-3">Date</th>
                        <th className="border border-gray-300 p-3">Type</th>
                        <th className="border border-gray-300 p-3">Amount (Rs.)</th>
                        <th className="border border-gray-300 p-3">Description</th>
                      </>
                    )}
                    {reportType === "customer" && (
                      <>
                        <th className="border border-gray-300 p-3">Customer Name</th>
                        <th className="border border-gray-300 p-3">Total Purchases</th>
                        <th className="border border-gray-300 p-3">Total Amount (Rs.)</th>
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
                        <th className="border border-gray-300 p-3">Total Revenue (Rs.)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reportType === "financial" &&
                    reportData.map((entry, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 p-3">{entry.date || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.type || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.amount || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.description || "-"}</td>
                      </tr>
                    ))}
                  {reportType === "customer" &&
                    reportData.map((entry, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 p-3">{entry.customerName || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.totalPurchases || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.totalAmount || "-"}</td>
                      </tr>
                    ))}
                  {reportType === "payroll" &&
                    reportData.map((entry, index) => (
                      <tr key={entry._id || index} className="text-center">
                        <td className="border border-gray-300 p-3">{index + 1}</td>
                        <td className="border border-gray-300 p-3">{entry.employeeName || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.designation || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.basicSalary || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.allowances || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.deductions || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.netSalary || "-"}</td>
                      </tr>
                    ))}
                  {reportType === "product" &&
                    reportData.map((entry, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 p-3">{entry.productName || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.unitsSold || "-"}</td>
                        <td className="border border-gray-300 p-3">{entry.totalRevenue || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportHub;