import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaClipboardCheck, FaGasPump, FaMapMarkedAlt, FaChartBar, FaBook, FaUser, FaSignOutAlt, FaBox, FaCar } from 'react-icons/fa';

export default function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <FaBook />, path: "/transport-dashboard" },
    { name: "Shipment Status", icon: <FaTruck />, path: "/ShipmentStatus" },
    { name: "Quality Check Log", icon: <FaClipboardCheck />, path: "/quality-check-log" },
    { name: "Fuel Tracker", icon: <FaGasPump />, path: "/fuel-tracker" },
    { name: "Vehicles", icon: <FaCar />, path: "/vehicles" }, // Added Vehicles option
    { name: "Shipment Scheduler", icon: <FaClipboardCheck />, path: "/shipment-scheduler" },
    { name: "Route Optimizer", icon: <FaMapMarkedAlt />, path: "/route-optimizer" },
    { name: "Transport Reports", icon: <FaChartBar />, path: "/transport-reports" },
    { name: "Customer Orders", icon: <FaBox />, path: "/dashboard/customer-orders" },
    { name: "Profile", icon: <FaUser />, path: "/transport-manager-profile" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-teal-100 text-gray-800 shadow-md border-r border-gray-200 p-6">
      <div className="border-b border-gray-200">
        <h2 className="text-2xl font-bold text-green-900 text-center">
          CRIPS
        </h2>
      </div>

      <nav className="mt-4 flex-1">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 px-4 py-3 rounded-xl transition duration-300 hover:bg-green-50 text-gray-600 hover:text-green-900 group"
          >
            <div className="text-lg text-green-500 group-hover:text-green-600 transition-colors duration-300">
              {item.icon}
            </div>
            <span className="text-lg font-medium group-hover:text-green-900 transition-colors duration-300">
              {item.name}
            </span>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200">
        <div
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl transition duration-300 bg-green-500 hover:bg-green-600 text-white cursor-pointer group"
        >
          <div className="text-lg text-white group-hover:text-gray-100 transition-colors duration-300">
            <FaSignOutAlt />
          </div>
          <span className="text-lg font-medium group-hover:text-gray-100 transition-colors duration-300">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}