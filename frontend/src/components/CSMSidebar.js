// CRIPS/frontend/src/components/CSMSidebar.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Add these imports
import { MdDashboard } from "react-icons/md";
import { FiShoppingCart, FiDollarSign, FiTruck, FiHeadphones, FiUsers, FiTag, FiSettings, FiChevronDown } from "react-icons/fi";

const CSMSidebar = () => {
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const [customerManagementOpen, setCustomerManagementOpen] = useState(false); // Add state for Customer Management dropdown
  const [selectedItem, setSelectedItem] = useState("/customer-service-dashboard"); // Default selected item
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // For programmatic navigation

  // Sync selectedItem with current route on mount and route change
  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // Automatically open Help Center dropdown if on a related route
    if (
      currentPath === "/dashboard/knowledge-base" ||
      currentPath === "/dashboard/support-tickets"
    ) {
      setHelpCenterOpen(true);
    } else {
      setHelpCenterOpen(false);
    }

    // Automatically open Customer Management dropdown if on a related route
    if (
      currentPath === "/customer-management" ||
      currentPath === "/customer-requests"
    ) {
      setCustomerManagementOpen(true);
    } else {
      setCustomerManagementOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (href) => {
    if (href === "#help-center") {
      // Toggle Help Center dropdown without navigating
      setHelpCenterOpen(!helpCenterOpen);
      setSelectedItem(href);
    } else if (href === "#customer-management") {
      // Toggle Customer Management dropdown without navigating
      setCustomerManagementOpen(!customerManagementOpen);
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
            href="/customer-service-dashboard"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/customer-service-dashboard");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/customer-service-dashboard"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MdDashboard className="mr-3" /> Dashboard
          </a>
        </li>
        <li>
          <a
            href="#manage-orders"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("#manage-orders");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "#manage-orders"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiShoppingCart className="mr-3" /> Manage Orders
          </a>
        </li>
        <li>
          <a
            href="#payments"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("#payments");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "#payments"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiDollarSign className="mr-3" /> Refund Requests
          </a>
        </li>
        <li>
          <a
            href="#shipments"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("#shipments");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "#shipments"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiTruck className="mr-3" /> Shipment Tracking
          </a>
        </li>

        {/* Help Center with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#help-center")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#help-center" ||
              selectedItem === "/dashboard/knowledge-base" ||
              selectedItem === "/dashboard/support-tickets"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center">
              <FiHeadphones className="mr-3" /> Help Center
            </span>
            <FiChevronDown
              className={`transition-transform ${helpCenterOpen ? "rotate-180" : ""}`}
            />
          </button>

          {helpCenterOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/dashboard/knowledge-base"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/dashboard/knowledge-base");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/dashboard/knowledge-base"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Knowledge Base
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/support-tickets"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/dashboard/support-tickets");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/dashboard/support-tickets"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Support Tickets
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Customer Management with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#customer-management")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#customer-management" ||
              selectedItem === "/customer-management" ||
              selectedItem === "/customer-requests"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center">
              <FiUsers className="mr-3" /> User Management
            </span>
            <FiChevronDown
              className={`transition-transform ${customerManagementOpen ? "rotate-180" : ""}`}
            />
          </button>

          {customerManagementOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/customers-list"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/customers-list");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/customers-list"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Customers
                </a>
              </li>
              <li>
                <a
                  href="/csm/customer-requests"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/csm/customer-requests");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/csm/customer-requests"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Customer Requests
                </a>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a
            href="#discounts"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("#discounts");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "#discounts"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiTag className="mr-3" /> Discounts & Promotions
          </a>
        </li>
        <li>
          <a
            href="#settings"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("#settings");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "#settings"
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

export default CSMSidebar;