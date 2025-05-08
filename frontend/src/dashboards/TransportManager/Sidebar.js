import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaClipboardCheck, FaGasPump, FaMapMarkedAlt, FaChartBar, FaBook, FaUser, FaSignOutAlt, FaBox, FaCar, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const navigate = useNavigate();
  const [globalMessage, setGlobalMessage] = useState(null); // For success/error messages
  const [globalMessageType, setGlobalMessageType] = useState(""); // Type: "success", "error", "confirm"
  const [confirmAction, setConfirmAction] = useState(null); // Store the action to confirm (logout)

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: <FaBook />, path: "/transport-dashboard" },
    { name: "Shipment Status", icon: <FaTruck />, path: "/ShipmentStatus" },
    { name: "Quality Check Log", icon: <FaClipboardCheck />, path: "/quality-check-log" },
    { name: "Fuel Tracker", icon: <FaGasPump />, path: "/fuel-tracker" },
    { name: "Vehicles", icon: <FaCar />, path: "/vehicles" },
    { name: "Drivers", icon: <FaUsers />, path: "/drivers" },
    { name: "Shipment Scheduler", icon: <FaClipboardCheck />, path: "/shipment-scheduler" },
    { name: "Route Optimizer", icon: <FaMapMarkedAlt />, path: "/route-optimizer" },
    { name: "Transport Reports", icon: <FaChartBar />, path: "/transport-reports" },
    { name: "Customer Orders", icon: <FaBox />, path: "/dashboard/customer-orders" },
    { name: "Profile", icon: <FaUser />, path: "/transport-manager-profile" },
  ];

  // Automatically clear global message after 3 seconds if it's a success or error
  React.useEffect(() => {
    if (globalMessage && (globalMessageType === "success" || globalMessageType === "error")) {
      const timer = setTimeout(() => {
        setGlobalMessage(null);
        setGlobalMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [globalMessage, globalMessageType]);

  const handleLogout = () => {
    localStorage.clear();
    setGlobalMessage("Logged out successfully!");
    setGlobalMessageType("success");
    setTimeout(() => {
      navigate('/login');
    }, 3000); // Navigate after the message fades
  };

  const showConfirmation = () => {
    setConfirmAction({ action: 'logout' });
    setGlobalMessage("Are you sure you want to logout?");
    setGlobalMessageType("confirm");
  };

  const handleConfirm = () => {
    if (confirmAction.action === 'logout') {
      handleLogout();
    }
  };

  const closeGlobalMessage = () => {
    setGlobalMessage(null);
    setGlobalMessageType("");
    setConfirmAction(null);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white text-gray-800 shadow-lg p-6 flex flex-col">
      {/* Logo Section */}
      <div className="mb-6 border-b border-gray-200 pb-4 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          CRIPS
        </h2>
      </div>

      {/* Global Message Display (Success/Error/Confirmation) */}
      <AnimatePresence>
        {globalMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`fixed z-50 p-4 rounded-xl shadow-lg flex items-center justify-between max-w-md w-full transition-all duration-300 ${
              globalMessageType === "success"
                ? "bg-green-100 border border-green-300 text-green-800 top-4 left-1/2 -translate-x-1/2"
                : globalMessageType === "error"
                ? "bg-red-100 border border-red-300 text-red-800 top-4 left-1/2 -translate-x-1/2"
                : "bg-gray-100 border border-gray-300 text-gray-800 inset-0 flex items-center justify-center"
            }`}
          >
            <span className="font-medium">{globalMessage}</span>
            <div className="flex space-x-2">
              {globalMessageType === "confirm" && (
                <>
                  <button
                    onClick={handleConfirm}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeGlobalMessage}
                    className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition-all duration-200"
                  >
                    No
                  </button>
                </>
              )}
              <button
                onClick={closeGlobalMessage}
                className="ml-4 text-xl font-bold hover:text-gray-600 focus:outline-none"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="relative flex items-center gap-4 px-4 py-3 mb-2 rounded-xl transition duration-300 hover:bg-teal-50 cursor-pointer group"
          >
            {/* Hover Background Effect */}
            <div className="absolute inset-0 bg-teal-50 rounded-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="relative text-xl text-teal-600 group-hover:text-teal-800 transition-colors duration-300">
              {item.icon}
            </div>
            <span className="relative text-base font-medium text-gray-700 group-hover:text-teal-800 transition-colors duration-300">
              {item.name}
            </span>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div
          onClick={showConfirmation}
          className="relative flex items-center gap-4 px-4 py-3 rounded-xl transition duration-300 bg-green-500 hover:bg-green-600 cursor-pointer group"
        >
          {/* Hover Background Effect */}
          <div className="absolute inset-0 bg-green-600 rounded-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          <div className="relative text-xl text-white group-hover:text-gray-100 transition-colors duration-300">
            <FaSignOutAlt />
          </div>
          <span className="relative text-base font-medium text-white group-hover:text-gray-100 transition-colors duration-300">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}