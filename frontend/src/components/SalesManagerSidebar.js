import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FiBarChart2, FiPackage, FiUsers, FiDollarSign, FiSettings, FiChevronDown } from "react-icons/fi";

const SalesManagerSidebar = () => {
  const [reportsOpen, setReportsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("/sales-manager-dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // Automatically open Reports dropdown
    if (
      currentPath === "/FinancialReport" ||
      currentPath === "/ProductReport" ||
      currentPath === "/CustomerReport" ||
      currentPath === "/ReportHub"
    ) {
      setReportsOpen(true);
    } else {
      setReportsOpen(false);
    }

    // Automatically open Settings dropdown
    if (
      currentPath === "/sales-manager-update-profile" ||
      currentPath === "/sales-manager-change-password"
    ) {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (href) => {
    if (href === "#reports") {
      setReportsOpen(!reportsOpen);
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
            href="/sales-manager-dashboard"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/sales-manager-dashboard");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/sales-manager-dashboard"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MdDashboard className="mr-3" /> Dashboard
          </a>
        </li>

        {/* Reports with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#reports")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#reports" ||
              selectedItem === "/FinancialReport" ||
              selectedItem === "/ProductReport" ||
              selectedItem === "/CustomerReport" ||
              selectedItem === "/ReportHub"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center">
              <FiBarChart2 className="mr-3" /> Reports
            </span>
            <FiChevronDown
              className={`transition-transform ${reportsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {reportsOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/FinancialReport"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/FinancialReport");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/FinancialReport"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Financial Report
                </a>
              </li>
              <li>
                <a
                  href="/ProductReport"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/ProductReport");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/ProductReport"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Products Report
                </a>
              </li>
              <li>
                <a
                  href="/CustomerReport"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/CustomerReport");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/CustomerReport"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Customer Reports
                </a>
              </li>
              <li>
                <a
                  href="/ReportHub"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/ReportHub");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/ReportHub"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Reports Hub
                </a>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a
            href="/SalarySheet"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick("/SalarySheet");
            }}
            className={`flex items-center p-3 rounded-lg ${
              selectedItem === "/SalarySheet"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiDollarSign className="mr-3" /> Employee Salary Sheet
          </a>
        </li>

        {/* Settings with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#settings")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#settings" ||
              selectedItem === "/sales-manager-update-profile" ||
              selectedItem === "/sales-manager-change-password"
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
                  href="/sales-manager-update-profile"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/sales-manager-update-profile");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/sales-manager-update-profile"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Update Profile
                </a>
              </li>
              <li>
                <a
                  href="/sales-manager-change-password"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/sales-manager-change-password");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/sales-manager-change-password"
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

export default SalesManagerSidebar;