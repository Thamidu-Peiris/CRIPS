//CRISPS\frontend\src\dashboards\SalesReports\ReportHub.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Placeholder components for individual reports
const FinancialReport = () => <div>Financial Report Content</div>;
const CustomerReport = () => <div>Customer Report Content</div>;
const PayrollReport = () => <div>Payroll Report Content</div>;
const ProductPerformanceReport = () => <div>Product Performance Report Content</div>;

const ReportHub =() => {
    const [reportType, setReportType] = useState("financial");

    return(
        <div className="flex h-screen">
              {/* Sidebar */}
              <div className="w-[275px] bg-gray-300 p-5">
                <h2 className="text-xl font-bold mb-5">Side Bar</h2>
                <ul className="space-y-5">
                  <li><Link to="/sales-manager-dashboard" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">🏠 Dashboard</Link></li>
                  <li><Link to="/FinancialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📉 Financial Report</Link></li>
                  <li><Link to="/ProductReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📦 Products Report</Link></li>
                  <li><Link to="/CustomerReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">👥 Customer Reports</Link></li>
                  <li><Link to="/SalarySheet" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">💰 Employee Salary Sheet</Link></li>
                  <li><Link to="/reports-hub" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📊 Reports Hub</Link></li>
                  <li><Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300"> ⚙ Settings</Link></li>
                </ul>
              </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-green-600 mb-6">Reports Hub</h1>
                <div className="mb-6">
                    <label className="mr-4 font-semibold">Select Report Type:</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="p-2 border rounded"
                        >

            <option value="financial">Financial Report</option>
            <option value="customer">Customer Report</option>
            <option value="payroll">Salary Payroll</option>
            <option value="product">Product Performance</option>
          </select>
        </div>

        {/* Render the selected report component */}
        {reportType === "financial" && <FinancialReport />}
        {reportType === "customer" && <CustomerReport />}
        {reportType === "payroll" && <PayrollReport />}
        {reportType === "product" && <ProductPerformanceReport />}
      </div>
        
    </div>

    );
};

export default ReportHub;