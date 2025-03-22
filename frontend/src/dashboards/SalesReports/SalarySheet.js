// CRIPS\frontend\src\dashboards\SalesReports\SalarySheet.js
import React from "react";
import { Link } from "react-router-dom";

const SalarySheet = () => {
    return (
        <div className ="felx h-parent">
            {/*Sidebar*/}
            <div className="w-1/6 bg-gray-300 p-5">
            <h2 className="text-xl font-bold mb-5">Side Bar</h2>
            <ul className="space-y-5">
                <li><Link to="/" className="">Home</Link></li>
                <li><Link to="/FinancialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Financial Report</Link></li>
                <li><Link to="/ProductsReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Products Report</Link></li>
                <li><Link to="/CustomerReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Customer Reports</Link></li>
                <li><Link to="/SalarySheet" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Employee Salary Sheet</Link></li>
                <li><Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Settings</Link></li>
            </ul>
            </div>
        </div>
    )
}


export default SalarySheet;