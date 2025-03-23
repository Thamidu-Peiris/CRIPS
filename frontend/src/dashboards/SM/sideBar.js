// CRIPS\frontend\src\dashboards\SM\sideBar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaUsers, FaChartBar, FaCog, FaBriefcase, FaEnvelope, FaStar, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white shadow-lg fixed p-6 border-r border-gray-700/50">
      {/* Logo/Title */}
      <h2 className="text-2xl font-bold mb-8 text-center text-cyan-400">Crips</h2>

      {/* Navigation Links */}
      <ul className="space-y-3">
        <li>
          <Link
            to="/sm-dashboard"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/sm-dashboard"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaHome className="mr-3 text-lg" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/SMprofile"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/SMprofile"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaUser className="mr-3 text-lg" />
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/empmanage"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/empmanage"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaUsers className="mr-3 text-lg" />
            Employees 
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/reports"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaChartBar className="mr-3 text-lg" />
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/customization"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/customization"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaCog className="mr-3 text-lg" />
            Customization
          </Link>
        </li>
        <li>
          <Link
            to="/admin-applications"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/admin-applications"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaBriefcase className="mr-3 text-lg" />
            Job Applications
          </Link>
        </li>
        <li>
          <Link
            to="/messages"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/messages"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaEnvelope className="mr-3 text-lg" />
            Messages
          </Link>
        </li>
        <li>
          <Link
            to="/feedback"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/feedback"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaStar className="mr-3 text-lg" />
            Feedback
          </Link>
        </li>
        <li>
          <Link
            to="/customers"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/customers"
                ? "bg-cyan-500/20 text-cyan-400"
                : "hover:bg-gray-800 text-gray-300 hover:text-cyan-400"
            }`}
          >
            <FaUsers className="mr-3 text-lg" />
            Customers
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-xl transition duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;