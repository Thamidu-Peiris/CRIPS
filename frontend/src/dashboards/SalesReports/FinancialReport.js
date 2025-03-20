// CRIPS\frontend\src\dashboards\SalesReports\FinancialReport.js
import React from "react";
import { Link } from "react-router-dom";

const FinancialReport = () => {
    return (
        <div className ="flex h-parent">
            {/*Sidebar*/}
            <div className="w-1/6 bg-gray-300 p-5">
            <h2 className="text-xl font-bold mb-5">Side Bar</h2>
            <ul className="space-y-5">
                <li><Link to="/" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Home</Link></li>
                <li><Link to="/financialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Financial Report</Link></li>
                <li><Link to="/ProductsReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Products Report</Link></li>
                <li><Link to="/customerreport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Customer Reports</Link></li>
                <li><Link to="/salarypayroll" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Employee Salary Sheet</Link></li>
                <li><Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">Settings</Link></li>
            </ul>
            </div>

            {/*Main Content*/}
            <div className="w-4/5 p-10 text-center">
                <h1 className="text-3xl font-bold text-green-600">Financial Report</h1>

            {/* Summary Cards */}
            <div className="mt-10 flex justify-left gap-20">
                <div className="bg-white shadow-lg rounded-lg p-4 text-center border h-[210px] w-[305px]">
                    
                    <p className="font-bold mb-2">Total Revenue and Expenses Summary (Last 7 days)</p>
                    <div className="flex justify-between mb-2">
                    <p className="text-s font-semibold text-right">Total Income </p>
                    <p className="text-s font-semibold text-right">Rs.28000</p>
                    </div>
                    <div className="flex justify-between mb-2">
                    <p className="text-s font-semibold text-right">Total Expenses </p>
                    <p className="text-s font-semibold text-right">Rs.15000</p>
                    </div>
                    <div className="flex justify-between mb-2">
                    <p className="text-s font-semibold text-right">Discounts </p>
                    <p className="text-s font-semibold text-right">Rs.8000</p>
                    </div>
                    <div className="flex justify-between ">
                    <p className="text-s font-semibold text-right">Tax Payable </p>
                    <p className="text-s font-semibold text-right">Rs.5000</p>
                    </div>

                </div>
        
                <div className="ml-auto bg-white shadow-lg rounded-lg p-5 text-center border h-[205px] w-[300px]">
                    <p className="font-bold mb-2">Export File(Last month)</p>
                    <h2 className="text-s font-semibold">Download as Excel Spreadsheet</h2>
                    <h2 className="text-s font-semibold">Download as PDF</h2>
                    
                </div>

                    
            </div>    

            </div>

        </div>

    


    )
}


export default FinancialReport;