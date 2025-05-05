import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FiShoppingCart, FiTruck, FiHeadphones, FiUsers, FiTag, FiSettings, FiChevronDown } from "react-icons/fi";

const CSMSidebar = () => {
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const [customerManagementOpen, setCustomerManagementOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); // New state for Settings dropdown
  const [selectedItem, setSelectedItem] = useState("/csm/dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // Automatically open Help Center dropdown
    if (
      currentPath === "/csm/knowledge-base" ||
      currentPath === "/csm/support-tickets"
    ) {
      setHelpCenterOpen(true);
    } else {
      setHelpCenterOpen(false);
    }

    // Automatically open Customer Management dropdown
    if (
      currentPath === "/csm/customers-list" ||
      currentPath === "/csm/customer-requests"
    ) {
      setCustomerManagementOpen(true);
    } else {
      setCustomerManagementOpen(false);
    }

    // Automatically open Settings dropdown
    if (
      currentPath === "/csm/update-profile" ||
      currentPath === "/csm/change-password"
    ) {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (href) => {
    if (href === "#help-center") {
      setHelpCenterOpen(!helpCenterOpen);
      setSelectedItem(href);
    } else if (href === "#customer-management") {
      setCustomerManagementOpen(!customerManagementOpen);
      setSelectedItem(href);
    } else if (href === "#settings") {
      setSettingsOpen(!settingsOpen);
      setSelectedItem(href);
    } else {
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
            href="/csm/dashboard"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/csm/dashboard");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/csm/dashboard"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MdDashboard className="mr-3" /> Dashboard
          </a>
        </li>
        <li>
          <a
            href="/csm/manage-orders"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/csm/manage-orders");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/csm/manage-orders"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiShoppingCart className="mr-3" /> Manage Orders
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
              selectedItem === "/csm/knowledge-base" ||
              selectedItem === "/csm/support-tickets"
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
                  href="/csm/knowledge-base"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/csm/knowledge-base");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/csm/knowledge-base"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Knowledge Base
                </a>
              </li>
              <li>
                <a
                  href="/csm/support-tickets"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/csm/support-tickets");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/csm/support-tickets"
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
              selectedItem === "/csm/customers-list" ||
              selectedItem === "/csm/customer-requests"
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
                  href="/csm/customers-list"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/csm/customers-list");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/csm/customers-list"
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
            href="/csm/coupons"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/csm/coupons");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/csm/coupons"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiTag className="mr-3" /> Discounts & Promotions
          </a>
        </li>

        {/* Settings with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#settings")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#settings" ||
              selectedItem === "/csm/update-profile" ||
              selectedItem === "/csm/change-password"
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
                  href="/update-profile"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/update-profile");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/update-profile"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Update Profile
                </a>
              </li>
              <li>
                <a
                  href="/change-password"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/change-password");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/change-password"
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

export default CSMSidebar;