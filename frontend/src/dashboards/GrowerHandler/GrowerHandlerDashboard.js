// CRIPS\frontend\src\dashboards\GrowerHandler\GrowerHandlerDashboard.js
import React from "react";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";

const GrowerHandlerDashboard = () => {
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
          </h2>
          <p className="text-gray-600">
            Welcome to your dashboard, Grower Handler! Here you can manage plants, assign tasks, and monitor conditions.
          </p>

          {/* Placeholder for Dashboard Widgets */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Plant Inventory</h3>
              <p className="text-gray-600">Manage your plant records here.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Task Assignments</h3>
              <p className="text-gray-600">Assign tasks to cutters.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Environmental Monitoring</h3>
              <p className="text-gray-600">Track plant conditions in real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowerHandlerDashboard;