import React from "react";
import { useNavigate } from "react-router-dom";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";

const GrowerHandlerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <GHSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <GHNavbar />

        {/* Dashboard Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Grower Handler Dashboard
          </h2>
          <p className="text-gray-600">
            Welcome to your dashboard, Grower Handler! Here you can manage plants, assign tasks, and monitor conditions.
          </p>

          {/* Dashboard Widgets */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plant Inventory Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Plant Inventory</h3>
              <p className="text-gray-600 mb-4">Manage your plant records here.</p>

              {/* Add a New Plant */}
              <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition mb-4">
                <h4 className="text-md font-semibold text-green-700">Add a New Plant</h4>
                <p className="text-gray-500 mb-2">Register a new plant with its details.</p>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  onClick={() => navigate("/dashboards/GrowerHandler/plantFormPage")}
                >
                  Add Plant
                </button>
              </div>

              {/* Manage Plant Details */}
              <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition mb-4">
                <h4 className="text-md font-semibold text-blue-700">Manage Plant Details</h4>
                <p className="text-gray-500 mb-2">Update or delete existing plants.</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => navigate("/manage-plants")}
                >
                  Manage Plants
                </button>
              </div>

              {/* View All Plants */}
              <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
                <h4 className="text-md font-semibold text-orange-700">View All Plants</h4>
                <p className="text-gray-500 mb-2">See the complete plant catalog.</p>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                  onClick={() => navigate("/all-plants")}
                >
                  View Plants
                </button>
              </div>
            </div>

            {/* Task Assignments Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Task Assignments</h3>
              <p className="text-gray-600 mb-4">Assign tasks to cutters.</p>

              {/* Assign Tasks */}
              <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition mb-4">
                <h4 className="text-md font-semibold text-purple-700">Assign Tasks</h4>
                <p className="text-gray-500 mb-2">Allocate tasks to growers.</p>
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  onClick={() => navigate("/dashboards/GrowerHandler/assign-tasks")}
                >
                  Assign
                </button>
              </div>

              {/* Manage all Tasks */}
              <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
                <h4 className="text-md font-semibold text-red-700">Manage all Tasks</h4>
                <p className="text-gray-500 mb-2">Manage and Monitor Tasks</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  onClick={() => navigate("/dashboards/GrowerHandler/manage-tasks")} // Note
                >
                  Manage Tasks
                </button>
              </div>
            </div>

            {/* Environmental Monitoring Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Environmental Monitoring</h3>
              <p className="text-gray-600 mb-4">Track plant conditions in real-time.</p>

              {/* Environmental Monitoring */}
              <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
                <h4 className="text-md font-semibold text-teal-700">Environmental Monitoring</h4>
                <p className="text-gray-500 mb-2">Track humidity, temperature, and other conditions.</p>
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                  onClick={() => navigate("/monitor-environment")}
                >
                  Monitor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowerHandlerDashboard;