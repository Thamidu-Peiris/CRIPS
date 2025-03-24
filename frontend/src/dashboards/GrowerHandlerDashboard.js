// CRIPS\frontend\src\dashboards\GrowerHandlerDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const GrowerHandlerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">Grower Handler Dashboard</h1>
      <p className="text-gray-600 mb-4">Manage your plants, monitor environments, and assign tasks.</p>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        {/* Add New Plant */}
        <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-green-700">Add a New Plant</h2>
          <p className="text-gray-500 mb-2">Register a new plant with its details.</p>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={() => navigate("/dashboards/GrowerHandler/plantFormPage")}
          >
            Add Plant
          </button>
        </div>

        {/* Manage Plant Details */}
        <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-blue-700">Manage Plant Details</h2>
          <p className="text-gray-500 mb-2">Update or delete existing plants.</p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => navigate("/manage-plants")}
          >
            Manage Plants
          </button>
        </div>

       {/* View All Plants  */}
       <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-orange-700">View All Plants</h2>
          <p className="text-gray-500 mb-2">See the complete plant catalog.</p>
          <button 
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-700"
            onClick={() => navigate("/all-plants")}
          >
            View Plants
          </button>
        </div>

        {/* Environmental Monitoring */}
        <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-teal-700">Environmental Monitoring</h2>
          <p className="text-gray-500 mb-2">Track humidity, temperature, and other conditions.</p>
          <button 
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700"
            onClick={() => navigate("/monitor-environment")}
          >
            Monitor
          </button>
        </div>

        {/* Assign Tasks */}
        <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-purple-700">Assign Tasks</h2>
          <p className="text-gray-500 mb-2">Allocate tasks to growers.</p>
          <button 
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            onClick={() => navigate("/dashboards/GrowerHandler/assign-tasks")}
          >
            Assign
          </button>
        </div>

        {/* Manage Tasks */}
       <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-red-700">Manage all Tasks</h2>
      <p className="text-gray-500 mb-2">Manage and Monitor Tasks</p>
      <button 
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
      onClick={() => navigate("//dashboards/GrowerHandler/manage-tasks")}
      >
      Manage Tasks
          </button>
        </div>

      </div>
    </div>
  );
};

export default GrowerHandlerDashboard;
