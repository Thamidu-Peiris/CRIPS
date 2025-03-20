// CRIPS\frontend\src\dashboards\SM\dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './sideBar.js';// ✅ Correct pa


const Dashboard = () => {
    const [stats, setStats] = useState({ sales: 0, stock: 0, visitors: 0 });
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const salesResponse = await axios.get("http://localhost:4000/api/stats/sales");
            const stockResponse = await axios.get("http://localhost:4000/api/stats/stock");
            const visitorsResponse = await axios.get("http://localhost:4000/api/stats/visitors");
            const ordersResponse = await axios.get("http://localhost:4000/api/orders/recent");
            
            setStats({
                sales: salesResponse.data.total,
                stock: stockResponse.data.total,
                visitors: visitorsResponse.data.total,
            });
            setOrders(ordersResponse.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 min-h-screen bg-gray-100 p-6 w-full">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Sales</h2>
                        <p className="text-3xl font-bold">{stats.sales}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Stock</h2>
                        <p className="text-3xl font-bold">{stats.stock}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Visitors</h2>
                        <p className="text-3xl font-bold">{stats.visitors}</p>
                    </div>
                </div>
                
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <ul>
                        {orders.map((order) => (
                            <li key={order._id} className="border-b py-2">
                                <span className="font-medium">{order.item}</span> - {order.date} - ${order.price}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;