import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FiPackage, FiTruck, FiUsers, FiSettings, FiChevronDown } from "react-icons/fi";
import { GiPlantRoots } from "react-icons/gi";

const InventorySidebar = () => {
  const [selectedItem, setSelectedItem] = useState("/inventory-manager-dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // Automatically open Settings dropdown
    if (
      currentPath === "/inv-update-profile" ||
      currentPath === "/inv-change-password"
    ) {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (href) => {
    if (href === "#settings") {
      setSettingsOpen(!settingsOpen);
      setSelectedItem(href);
    } else {
      setSelectedItem(href);
      navigate(href);
    }
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
          <button
            onClick={() => handleItemClick("#settings")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#settings" ||
              selectedItem === "/inventory/update-profile" ||
              selectedItem === "/inventory/change-password"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center">
              <FiSettings className="mr-3" /> Settings
            </span>
            <FiChevronDown
              className={`transition-transform ${settingsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {settingsOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/inv-update-profile"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/inv-update-profile");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/inv-update-profile"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Update Profile
                </a>
              </li>
              <li>
                <a
                  href="/inv-change-password"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/inv-change-password");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/inv-change-password"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Change Password
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default InventorySidebar;