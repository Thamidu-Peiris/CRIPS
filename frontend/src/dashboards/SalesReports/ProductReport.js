// CRIPS\frontend\src\dashboards\SalesReports\ProductReport.js
import React from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";

const data = [
    { name: "Plant 1", value: 78 },
    { name: "Plant 2", value: 44 },
    { name: "Plant 3", value: 42 },
    { name: "Plant 4", value: 64 },
    { name: "Plant 5", value: 16 },
    { name: "Plant 6", value: 27 },
    { name: "Plant 7", value: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560", "#33FF57"];

const topSellingPlants = [
    { id: 1, name: "Plant 1", sold: 600, image: "plant4.jpg" },
    { id: 2, name: "Plant 2", sold: 543, image: "plant2.jpg" },
    { id: 3, name: "Plant 3", sold: 420, image: "hero-image3.jpg" }
];

const leastSellingPlants = [
    { id: 5, name: "Plant 5", sold: 93, image: "plant3.jpg" },
    { id: 4, name: "Plant 4", sold: 67, image: "hero-image2.jpg" },
    { id: 6, name: "Plant 6", sold: 44, image: "hero-image1.jpg" }
];

const ProductReport = () => {
    return (
        <div className="flex h-parent bg-gray-100">
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
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-green-600">Product Performance Report</h1>
                  <button className="bg-green-500 px-4 py-2 rounded-full">Generate Report</button>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-2 gap-3 gap-x-0">
                  {/*Top-selling Section*/}
                    <div className="max-w-sm p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center ml-20">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold mb-3 mt-2">Top Selling Plants</h2>
                        </div>
                        <div>
                            {topSellingPlants.map((plant) => (
                                <div key={plant.id} className="flex items-center space-x-4 mb-5">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                                        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{plant.name}</p>
                                        <p className="text-sm text-gray-600">Units Sold: {plant.sold}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/*Least-selling Section*/}
                    <div className="max-w-sm p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold mb-3 ">Least Selling Plants</h2>
                        </div>
                        <div>
                            {leastSellingPlants.map((plant) => (
                                <div key={plant.id} className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                                        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{plant.name}</p>
                                        <p className="text-sm text-gray-600">Units Sold: {plant.sold}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sales Trend Pie Chart */}
                    <div className="max-w-sm p-5 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center ml-20">
                        <h2 className="text-lg font-bold mb-4">Sales Trend of Plants (Average)</h2>
                        <PieChart width={300} height={300}>
                            <Pie 
                              data={data} 
                              cx={150} 
                              cy={150} 
                              outerRadius={100} 
                              fill="#8884d8" 
                              dataKey="value" 
                              label={({ name }) => name}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Inventory Sold */}
                          <div className="w-[385px] h-[200px] p-5 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
                            <h2 className="text-lg font-bold mb-4">Inventory Sold (%)</h2>
                            <p className="text-2xl font-bold">78%</p>
                          </div>

                        {/* Export Report*/}
                          <div className="w-[385px] h-[200px] p-5 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
                            <p className="font-bold mb-2">Export File</p>
                            <h2 className="text-sm font-semibold mb-2">Download as CSV SpreadSheet or a PDF</h2>
                            <Link to="/ReportHub" className="bg-green-500 text-black px-4 py-2 rounded-full mr-2"> Go to Report Hub </Link>
                          </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReport;