import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaLeaf, FaUsers, FaCog, FaChevronDown, FaFolder } from "react-icons/fa";

const GHSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [plantManagementOpen, setPlantManagementOpen] = useState(false);
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);
  const [envMenuOpen, setEnvMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // Plant Management Dropdown
    if (currentPath.includes("/plantFormPage") || currentPath.includes("/manage-plants") || currentPath.includes("/all-plants")) {
      setPlantManagementOpen(true);
    } else {
      setPlantManagementOpen(false);
    }

    // Task Assignments Dropdown
    if (currentPath.includes("/assign-tasks") || currentPath.includes("/manage-tasks")) {
      setTaskMenuOpen(true);
    } else {
      setTaskMenuOpen(false);
    }

    // Environmental Monitoring Dropdown
    if (currentPath.includes("/add-environmental-data") || currentPath.includes("/monitor-environment")) {
      setEnvMenuOpen(true);
    } else {
      setEnvMenuOpen(false);
    }

    // Settings Dropdown
    if (currentPath.includes("/update-profile") || currentPath.includes("/change-password")) {
      setSettingsMenuOpen(true);
    } else {
      setSettingsMenuOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (href) => {
    setSelectedItem(href);
    navigate(href);
  };

  return (
    <nav className="w-72 bg-white shadow-lg p-6 rounded-2xl m-4 hidden md:block">
      <img src="/logo.png" alt="Logo" className="h-16 mx-auto pb-4" />

      <ul className="space-y-4">
        {/* Dashboard */}
        <li>
          <a
            href="/grower-handler-dashboard"
            onClick={(e) => { e.preventDefault(); handleItemClick("/grower-handler-dashboard"); }}
            className={`flex items-center p-3 rounded-lg ${selectedItem === "/grower-handler-dashboard" ? "bg-green-200 text-gray-800" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <MdDashboard className="mr-3" /> Dashboard
          </a>
        </li>

{/* Categories */}
{/* 
<li>
  <a
    href="/grower-handler/manage-categories"
    onClick={(e) => { e.preventDefault(); handleItemClick("/grower-handler/manage-categories"); }}
    className={`flex items-center p-3 rounded-lg ${selectedItem === "/grower-handler/manage-categories" ? "bg-green-200 text-gray-800" : "text-gray-700 hover:bg-gray-200"}`}
  >
    <FaFolder className="mr-3" /> Categories
  </a>
</li> 
*/}

        {/* Plant Management */}
        <li>
          <button
            onClick={() => setPlantManagementOpen(!plantManagementOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              ["/dashboards/GrowerHandler/plantFormPage", "/manage-plants", "/all-plants"].includes(selectedItem)
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center"><FaLeaf className="mr-3" /> Plant Management</span>
            <FaChevronDown className={`transition-transform ${plantManagementOpen ? "rotate-180" : ""}`} />
          </button>
          {plantManagementOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/dashboards/GrowerHandler/plantFormPage"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/dashboards/GrowerHandler/plantFormPage"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/dashboards/GrowerHandler/plantFormPage" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  Add New Plant
                </a>
              </li>
              <li>
                <a
                  href="/manage-plants"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/manage-plants"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/manage-plants" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  Manage Plant Details
                </a>
              </li>
              <li>
                <a
                  href="/all-plants"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/all-plants"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/all-plants" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  View All Plants
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Task Assignments */}
        <li>
          <button
            onClick={() => setTaskMenuOpen(!taskMenuOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              ["/dashboards/GrowerHandler/assign-tasks", "/dashboards/GrowerHandler/manage-tasks"].includes(selectedItem)
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center"><FaUsers className="mr-3" /> Task Assignments</span>
            <FaChevronDown className={`transition-transform ${taskMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {taskMenuOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/dashboards/GrowerHandler/assign-tasks"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/dashboards/GrowerHandler/assign-tasks"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/dashboards/GrowerHandler/assign-tasks" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  Assign Tasks
                </a>
              </li>
              <li>
                <a
                  href="/dashboards/GrowerHandler/manage-tasks"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/dashboards/GrowerHandler/manage-tasks"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/dashboards/GrowerHandler/manage-tasks" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  Manage All Tasks
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Environmental Monitoring */}
        <li>
          <button
            onClick={() => setEnvMenuOpen(!envMenuOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              ["/dashboards/GrowerHandler/add-environmental-data", "/monitor-environment"].includes(selectedItem)
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center"><FaLeaf className="mr-3" /> Env. Monitoring</span>
            <FaChevronDown className={`transition-transform ${envMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {envMenuOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/dashboards/GrowerHandler/add-environmental-data"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/dashboards/GrowerHandler/add-environmental-data"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/dashboards/GrowerHandler/add-environmental-data" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  Add Environmental Data
                </a>
              </li>
              <li>
                <a
                  href="/monitor-environment"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/monitor-environment"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/monitor-environment" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  Environmental Monitoring
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Settings */}
        <li>
          <button
            onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              ["/grower-handler/update-profile", "/grower-handler/change-password"].includes(selectedItem)
                ? "bg-green-200 text-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center"><FaCog className="mr-3" /> Settings</span>
            <FaChevronDown className={`transition-transform ${settingsMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {settingsMenuOpen && (
            <ul className="ml-8 mt-2 space-y-2">
              <li>
                <a
                  href="/grower-handler/update-profile"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/grower-handler/update-profile"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/grower-handler/update-profile" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
                >
                  Update Profile
                </a>
              </li>
              <li>
                <a
                  href="/grower-handler/change-password"
                  onClick={(e) => { e.preventDefault(); handleItemClick("/grower-handler/change-password"); }}
                  className={`block p-2 rounded-lg ${selectedItem === "/grower-handler/change-password" ? "bg-green-200 text-gray-800" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"}`}
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

export default GHSidebar;