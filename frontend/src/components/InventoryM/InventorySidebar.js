import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FiPackage, FiTruck, FiUsers, FiSettings } from "react-icons/fi";
import { GiPlantRoots } from "react-icons/gi";

const InventorySidebar = () => {
  const [selectedItem, setSelectedItem] = useState("/inventory-manager-dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);
  }, [location.pathname]);

  const handleItemClick = (href) => {
    setSelectedItem(href);
    navigate(href);
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-72 bg-white shadow-lg p-6 rounded-2xl m-4">
      <img src="/logo.png" alt="Logo" className="h-16 mx-auto pb-4" />

      <ul className="space-y-4">
        <li>
          <a
            href="/inventory-manager-dashboard"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/inventory-manager-dashboard");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/inventory-manager-dashboard"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MdDashboard className="mr-3" /> Dashboard
          </a>
        </li>
        <li>
          <a
            href="/in-stock"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/in-stock");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/in-stock"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiPackage className="mr-3" /> In Stock
          </a>
        </li>
        <li>
          <a
            href="/add-stock"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/add-stock");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/add-stock"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <GiPlantRoots className="mr-3" /> Add Stock
          </a>
        </li>
        <li>
          <a
            href="/suppliers"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/suppliers");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/suppliers"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiUsers className="mr-3" /> Supplier List
          </a>
        </li>
        <li>
          <a
            href="/order-stock"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/order-stock");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/order-stock"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiTruck className="mr-3" /> Order Stock
          </a>
        </li>
        <li>
          <a
            href="/inventory/settings"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/inventory/settings");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/inventory/settings"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiSettings className="mr-3" /> Settings
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default InventorySidebar;