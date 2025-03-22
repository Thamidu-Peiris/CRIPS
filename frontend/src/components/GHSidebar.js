// CRIPS\frontend\src\components\GHSidebar.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaLeaf, FaUsers, FaCog, FaChevronDown, FaFolder } from "react-icons/fa";

const GHSidebar = () => {
  const [plantManagementOpen, setPlantManagementOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("/grower-handler-dashboard");
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // For programmatic navigation

  // Sync selectedItem with current route on mount and route change
  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // Automatically open Plant Management dropdown if on a related route
    if (
      currentPath === "/grower-handler/plants" ||
      currentPath === "/grower-handler/add-new-plant"
    ) {
      setPlantManagementOpen(true);
    } else {
      setPlantManagementOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (href) => {
    if (href === "#plant-management") {
      // Toggle dropdown without navigating
      setPlantManagementOpen(!plantManagementOpen);
      setSelectedItem(href);
    } else {
      // Navigate to the route and update selected item
      setSelectedItem(href);
      navigate(href);
    }
  };

  return (
    <nav className="w-72 bg-white shadow-lg p-6 rounded-2xl m-4 hidden md:block">
      <img src="/logo.png" alt="Logo" className="h-16 mx-auto pb-4" />

      <ul className="space-y-4">
        <li>
          <a
            href="/grower-handler-dashboard"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/grower-handler-dashboard");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/grower-handler-dashboard"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MdDashboard className="mr-3" /> Dashboard
          </a>
        </li>

        {/* Categories Menu */}
        <li>
          <a
            href="/grower-handler/manage-categories"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/grower-handler/manage-categories"); // Use actual route
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/grower-handler/manage-categories"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaFolder className="mr-3" /> Categories
          </a>
        </li>

        {/* Plant Management with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#plant-management")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#plant-management" ||
              selectedItem === "/grower-handler/plants" ||
              selectedItem === "/grower-handler/add-new-plant"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center">
              <FaLeaf className="mr-3" /> Plant Management
            </span>
            <FaChevronDown
              className={`transition-transform ${plantManagementOpen ? "rotate-180" : ""}`}
            />
          </button>

          {plantManagementOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/grower-handler/plants"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/grower-handler/plants");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/grower-handler/plants"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Plants
                </a>
              </li>
              <li>
                <a
                  href="/grower-handler/add-new-plant"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/grower-handler/add-new-plant");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/grower-handler/add-new-plant"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Add New Plant
                </a>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a
            href="/grower-handler/task-assignments"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/grower-handler/task-assignments");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/grower-handler/task-assignments"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaUsers className="mr-3" /> Task Assignments
          </a>
        </li>
        <li>
          <a
            href="/grower-handler/environmental-monitoring"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/grower-handler/environmental-monitoring");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/grower-handler/environmental-monitoring"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaLeaf className="mr-3" /> Environmental Monitoring
          </a>
        </li>
        <li>
          <a
            href="/grower-handler/settings"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/grower-handler/settings");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/grower-handler/settings"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaCog className="mr-3" /> Settings
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default GHSidebar;