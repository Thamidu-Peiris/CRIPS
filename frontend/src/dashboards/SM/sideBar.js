import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaUsers, FaChartBar, FaCog, FaBriefcase, FaEnvelope, FaStar, FaSignOutAlt, FaBox, FaPlusCircle } from "react-icons/fa";

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
    <div className="w-64 h-screen bg-teal-100 text-gray-800 shadow-md fixed p-6 border-r border-gray-200">
      {/* Logo/Title */}
      <h2 className="text-2xl font-bold mb-8 text-center text-green-900">Crips</h2>

      {/* Navigation Links */}
      <ul className="space-y-3">
        <li>
          <Link
            to="/sm-dashboard"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/sm-dashboard"
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
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
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
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
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
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
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
            }`}
          >
            <FaChartBar className="mr-3 text-lg" />
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/customize"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/customize"
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
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
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
            }`}
          >
            <FaBriefcase className="mr-3 text-lg" />
            Job Applications
          </Link>
        </li>
        <li>
          <Link
            to="/add-vacancies"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/add-vacancies"
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
            }`}
          >
            <FaPlusCircle className="mr-3 text-lg" />
            Add Vacancies
          </Link>
        </li>
        <li>
          <Link
            to="/approve-suppliers"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/approve-suppliers"
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
            }`}
          >
            <FaBox className="mr-3 text-lg" />
            Approve Suppliers
          </Link>
        </li>
        <li>
          <Link
            to="/messages"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/messages"
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
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
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
            }`}
          >
            <FaStar className="mr-3 text-lg" />
            Feedback
          </Link>
        </li>
        <li>
          <Link
            to="/sm-manage-cus"
            className={`flex items-center p-3 rounded-xl transition duration-300 ${
              location.pathname === "/sm-manage-cus"
                ? "bg-green-200 text-green-900"
                : "hover:bg-green-50 text-gray-600 hover:text-green-900"
            }`}
          >
            <FaUsers className="mr-3 text-lg" />
            Customers
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-xl transition duration-300 bg-green-500 hover:bg-green-600 text-white"
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