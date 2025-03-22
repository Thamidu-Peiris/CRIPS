// CRIPS\frontend\src\dashboards\SM\sideBar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-white shadow-md p-4 fixed">
            <h2 className="text-xl font-bold mb-6">Crips</h2>
            <ul className="space-y-4">
                <li><Link to="/dashboard" className="block p-2 hover:bg-gray-200">Dashboard</Link></li>
                <li><Link to="/profile" className="block p-2 hover:bg-gray-200">Profile</Link></li>
                <li><Link to="/employees" className="block p-2 hover:bg-gray-200">Employees</Link></li>
                <li><Link to="/reports" className="block p-2 hover:bg-gray-200">Reports</Link></li>
                <li><Link to="/customization" className="block p-2 hover:bg-gray-200">Customization</Link></li>
                <li><Link to="/admin-applications" className="block p-2 hover:bg-gray-200">Job Applications</Link></li>
                <li><Link to="/messages" className="block p-2 hover:bg-gray-200">Messages</Link></li>
                <li><Link to="/feedback" className="block p-2 hover:bg-gray-200">Feedback</Link></li>
                <li><Link to="/customers" className="block p-2 hover:bg-gray-200">Customers</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
