// CRIPS\frontend\src\dashboards\SalesReports\SalarySheet.js
import React from "react";
import { Link } from "react-router-dom";

const incstatement = [
  { no: "01", empname: "Employee A", designation: "System Manager", basic: 40000,  allowance: "1000", deduction: "-", netsal: 41000 },
  { no: "02", empname: "Employee B", designation: "Customer Service Manager", basic: 30000,  allowance: "2000", deduction: "-", netsal: 32000 },
  { no: "03", empname: "Employee C", designation: "Grower Handler", basic: 25000, allowance: "-", deduction: "500", netsal: 24500 },
  { no: "04", empname: "Employee D", designation: "Inventory Manager", basic: 20000,  allowance: "1000", deduction: "-", netsal: 21000 },
  { no: "05", empname: "Employee E", designation: "Sales Manager", basic: 20000,  allowance: "-", deduction: "1000", netsal: 19000 },
  { no: "06", empname: "Employee F", designation: "Cutter", basic: 15000,  allowance: "500", deduction: "100", netsal: 15400 },
];

const SalarySheet = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[275px] bg-gray-300 p-5">
        <h2 className="text-xl font-bold mb-5">Side Bar</h2>
        <ul className="space-y-5">
          <li><Link to="/sales-manager-dashboard" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">🏠 Dashboard</Link></li>
          <li><Link to="/FinancialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📉 Financial Report</Link></li>
          <li><Link to="/ProductReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📦 Products Report</Link></li>
          <li><Link to="/CustomerReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">👥 Customer Reports</Link></li>
          <li><Link to="/SalarySheet" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">💰 Employee Salary Sheet</Link></li>
          <li><Link to="/ReportHub" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📊 Reports Hub</Link></li>
          <li><Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300"> ⚙ Settings</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col justify-start">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-6">Employee Payroll</h1>
          <button className="bg-green-500 px-4 py-2 rounded-full">Generate Report</button>
        </div>

        {/* Income Statement */}
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold"> CRIPS Salary Sheet for the month</h2>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Sr. No</th>
                <th className="border border-gray-300 p-2">Name of Employee</th>
                <th className="border border-gray-300 p-2">Designation</th>
                <th className="border border-gray-300 p-2">Basic (Rs.)</th>
                <th className="border border-gray-300 p-2">Allowances / OverTime (Rs.)</th>
                <th className="border border-gray-300 p-2">Deductions (Rs.)</th>
                <th className="border border-gray-300 p-2">Net Salary (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {incstatement.map((order, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{order.no}</td>
                  <td className="border border-gray-300 p-2">{order.empname}</td>
                  <td className="border border-gray-300 p-2">{order.designation}</td>
                  <td className="border border-gray-300 p-2">{order.basic}</td>
                  <td className="border border-gray-300 p-2">{order.allowance}</td>
                  <td className="border border-gray-300 p-2">{order.deduction}</td>
                  <td className="border border-gray-300 p-2">{order.netsal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalarySheet;