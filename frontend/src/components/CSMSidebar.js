// CRIPS\frontend\src\components\CSMSidebar.js
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FiShoppingCart, FiDollarSign, FiTruck, FiHeadphones, FiUsers, FiTag, FiSettings, FiChevronDown } from "react-icons/fi";

const CSMSidebar = () => {
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("/customer-service-dashboard"); // Default selected item

  const handleItemClick = (href) => {
    setSelectedItem(href);
    if (href === "#help-center") {
      setHelpCenterOpen(!helpCenterOpen);
    }
  };

  return (
    <nav className="w-72 bg-white shadow-lg p-6 rounded-2xl m-4 hidden md:block">
      <img src="/logo.png" alt="Logo" className="h-16 mx-auto pb-4" />

      <ul className="space-y-4">
        <li>
          <a
            href="/customer-service-dashboard"
            onClick={() => handleItemClick("/customer-service-dashboard")}
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
            onClick={() => handleItemClick("#manage-orders")}
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
            onClick={() => handleItemClick("#payments")}
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
            onClick={() => handleItemClick("#shipments")}
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
              selectedItem === "#help-center"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center">
              <FiHeadphones className="mr-3" /> Help Center
            </span>
            <FiChevronDown className={`transition-transform ${helpCenterOpen ? "rotate-180" : ""}`} />
          </button>

          {helpCenterOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/dashboard/knowledge-base"
                  onClick={() => handleItemClick("/dashboard/knowledge-base")}
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
                  onClick={() => handleItemClick("/dashboard/support-tickets")}
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

        <li>
          <a
            href="#customers"
            onClick={() => handleItemClick("#customers")}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "#customers"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiUsers className="mr-3" /> Customer Management
          </a>
        </li>
        <li>
          <a
            href="#discounts"
            onClick={() => handleItemClick("#discounts")}
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
            onClick={() => handleItemClick("#settings")}
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