import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

export default function TransportManagerDashboard() {
  const [stats, setStats] = useState({
    activeShipments: 0,
    fuelEfficiency: 0,
    onTimeDelivery: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transport/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch transport stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-72 p-8">
        <header className="p-6 bg-gradient-to-r from-cyan-600/90 to-blue-700/90 rounded-2xl shadow-xl backdrop-blur-md border border-cyan-500/20">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Transport Manager Dashboard
          </h1>
          <p className="text-lg mt-2 font-light text-cyan-100/80">
            Welcome, Transport Manager!
          </p>
        </header>

        {/* ✅ Dynamic Dashboard Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300">Active Shipments</h3>
            <p className="text-3xl font-bold mt-2">{stats.activeShipments}</p>
            <p className="text-sm text-gray-400 mt-1">In transit right now</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300">Fuel Efficiency</h3>
            <p className="text-3xl font-bold mt-2">{stats.fuelEfficiency} <span className="text-sm">mpg</span></p>
            <p className="text-sm text-gray-400 mt-1">Fleet average this week</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300">On-Time Delivery</h3>
            <p className="text-3xl font-bold mt-2">{stats.onTimeDelivery}%</p>
            <p className="text-sm text-gray-400 mt-1">This month’s performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
