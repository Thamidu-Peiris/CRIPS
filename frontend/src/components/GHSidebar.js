import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaLeaf, FaUsers, FaCog, FaChevronDown } from "react-icons/fa";

const GHSidebar = () => {
  const [plantManagementOpen, setPlantManagementOpen] = useState(false);
  const [taskAssignmentsOpen, setTaskAssignmentsOpen] = useState(false);
  const [envMonitoringOpen, setEnvMonitoringOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("/grower-handler-dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  // Sync selectedItem with current route on mount and route change
  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // Automatically open dropdowns if on a related route
    if (
      currentPath === "/dashboards/GrowerHandler/plantFormPage" ||
      currentPath === "/manage-plants" ||
      currentPath === "/all-plants"
    ) {
      setPlantManagementOpen(true);
    } else {
      setPlantManagementOpen(false);
    }

    if (
      currentPath === "/dashboards/GrowerHandler/assign-tasks" ||
      currentPath === "/dashboards/GrowerHandler/manage-tasks"
    ) {
      setTaskAssignmentsOpen(true);
    } else {
      setTaskAssignmentsOpen(false);
    }

    if (
      currentPath === "/dashboards/GrowerHandler/add-environmental-data" ||
      currentPath === "/monitor-environment"
    ) {
      setEnvMonitoringOpen(true);
    } else {
      setEnvMonitoringOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (href, dropdown) => {
    if (dropdown) {
      // Toggle dropdown without navigating
      if (dropdown === "plant-management") {
        setPlantManagementOpen(!plantManagementOpen);
      } else if (dropdown === "task-assignments") {
        setTaskAssignmentsOpen(!taskAssignmentsOpen);
      } else if (dropdown === "env-monitoring") {
        setEnvMonitoringOpen(!envMonitoringOpen);
      }
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

        {/* Plant Management with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#plant-management", "plant-management")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#plant-management" ||
              selectedItem === "/dashboards/GrowerHandler/plantFormPage" ||
              selectedItem === "/manage-plants" ||
              selectedItem === "/all-plants"
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
                  href="/dashboards/GrowerHandler/plantFormPage"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/dashboards/GrowerHandler/plantFormPage");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/dashboards/GrowerHandler/plantFormPage"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Add a Plant
                </a>
              </li>
              <li>
                <a
                  href="/manage-plants"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/manage-plants");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/manage-plants"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Manage Plants
                </a>
              </li>
              <li>
                <a
                  href="/all-plants"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/all-plants");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/all-plants"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  View Plants
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Task Assignments with Dropdown */}
        <li>
          <button
            onClick={() => handleItemClick("#task-assignments", "task-assignments")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              selectedItem === "#task-assignments" ||
              selectedItem === "/dashboards/GrowerHandler/assign-tasks" ||
              selectedItem === "/dashboards/GrowerHandler/manage-tasks"
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center">
              <FaUsers className="mr-3" /> Task Assignments
            </span>
            <FaChevronDown
              className={`transition-transform ${taskAssignmentsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {taskAssignmentsOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/dashboards/GrowerHandler/assign-tasks"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/dashboards/GrowerHandler/assign-tasks");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/dashboards/GrowerHandler/assign-tasks"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Assign
                </a>
              </li>
              <li>
                <a
                  href="/dashboards/GrowerHandler/manage-tasks"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick("/dashboards/GrowerHandler/manage-tasks");
                  }}
                  className={`block p-2 rounded-lg ${
                    selectedItem === "/dashboards/GrowerHandler/manage-tasks"
                      ? "bg-green-200 text-gray-800"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Manage Tasks
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Environmental Monitoring with Dropdown */}
<li>
  <button
    onClick={() => handleItemClick("#env-monitoring", "env-monitoring")}
    className={`flex items-center justify-between w-full p-3 rounded-lg ${
      selectedItem === "#env-monitoring" ||
      selectedItem === "/dashboards/GrowerHandler/add-environmental-data" ||
      selectedItem === "/monitor-environment"
        ? "bg-green-200 text-gray-800"
        : "text-gray-700 hover:bg-gray-200"
    }`}
  >
    <span className="flex items-center">
      <FaLeaf className="mr-3" /> Monitor Environment
    </span>
    <FaChevronDown
      className={`transition-transform ${envMonitoringOpen ? "rotate-180" : ""}`}
    />
  </button>

  {envMonitoringOpen && (
    <ul className="ml-8 mt-2 space-y-2">
      <li>
        <a
          href="/dashboards/GrowerHandler/add-environmental-data"
          onClick={(e) => {
            e.preventDefault();
            handleItemClick("/dashboards/GrowerHandler/add-environmental-data");
          }}
          className={`block p-2 rounded-lg ${
            selectedItem === "/dashboards/GrowerHandler/add-environmental-data"
              ? "bg-green-200 text-gray-800"
              : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
          }`}
        >
          Add Data
        </a>
      </li>
      <li>
        <a
          href="/monitor-environment"
          onClick={(e) => {
            e.preventDefault();
            handleItemClick("/monitor-environment");
          }}
          className={`block p-2 rounded-lg ${
            selectedItem === "/monitor-environment"
              ? "bg-green-200 text-gray-800"
              : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
          }`}
        >
          Monitor
        </a>
      </li>
    </ul>
  )}
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