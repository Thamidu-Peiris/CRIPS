import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaClipboardCheck, FaGasPump, FaMapMarkedAlt, FaChartBar, FaBook } from 'react-icons/fa';

export default function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <FaBook />, path: "/transport-dashboard" },
    { name: "Shipment Status", icon: <FaTruck />, path: "/ShipmentStatus" },
    { name: "Quality Check Log", icon: <FaClipboardCheck />, path: "/quality-check-log" },
    { name: "Fuel Tracker", icon: <FaGasPump />, path: "/fuel-tracker" },
    { name: "Shipment Scheduler", icon: <FaClipboardCheck />, path: "/shipment-scheduler" },
    { name: "Route Optimizer", icon: <FaMapMarkedAlt />, path: "/route-optimizer" },
    { name: "Transport Reports", icon: <FaChartBar />, path: "/transport-reports" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-72 bg-gray-900/95 backdrop-blur-xl text-white shadow-2xl border-r border-gray-800/50">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800/50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CRIPS
        </h2>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 cursor-pointer transition-all duration-300 group"
          >
            <div className="text-2xl text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
              {item.icon}
            </div>
            <span className="text-lg font-medium group-hover:text-cyan-200 transition-colors duration-300">
              {item.name}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}