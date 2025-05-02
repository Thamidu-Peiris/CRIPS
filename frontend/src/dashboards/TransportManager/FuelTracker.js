// frontend\src\dashboards\TransportManager\FuelTracker.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

export default function FuelTracker() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [summary, setSummary] = useState([]);
  const [log, setLog] = useState({ vehicleId: '', liters: '', cost: '', distance: '' });

  useEffect(() => {
    fetchFuelLogs();
    fetchFuelSummary();
  }, []);

  const fetchFuelLogs = async () => {
    const res = await axios.get('http://localhost:5000/api/fuel');
    setFuelLogs(res.data);
  };

  const fetchFuelSummary = async () => {
    const res = await axios.get('http://localhost:5000/api/fuel/summary');
    setSummary(res.data);
  };

  const handleAddLog = async () => {
    await axios.post('http://localhost:5000/api/fuel', log);
    setLog({ vehicleId: '', liters: '', cost: '', distance: '' });
    fetchFuelLogs();
    fetchFuelSummary();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-72 p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
            Fuel Consumption Tracker
          </h2>

          {/* Add Fuel Log Form */}
          <div className="mb-8 flex space-x-4">
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400"
              placeholder="Vehicle ID"
              value={log.vehicleId}
              onChange={(e) => setLog({ ...log, vehicleId: e.target.value })}
            />
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400"
              type="number"
              placeholder="Liters"
              value={log.liters}
              onChange={(e) => setLog({ ...log, liters: e.target.value })}
            />
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400"
              type="number"
              placeholder="Cost"
              value={log.cost}
              onChange={(e) => setLog({ ...log, cost: e.target.value })}
            />
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400"
              type="number"
              placeholder="Distance (km)"
              value={log.distance}
              onChange={(e) => setLog({ ...log, distance: e.target.value })}
            />
            <button
              onClick={handleAddLog}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              Add Log
            </button>
          </div>

          {/* Fuel Logs Table */}
          <h3 className="text-xl font-semibold text-cyan-300 mb-4">All Fuel Logs</h3>
          <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner mb-8 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Vehicle</th>
                  <th className="py-2 px-4">Liters</th>
                  <th className="py-2 px-4">Cost</th>
                  <th className="py-2 px-4">Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map((log) => (
                  <tr key={log._id} className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-all duration-200">
                    <td className="py-2 px-4">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{log.vehicleId}</td>
                    <td className="py-2 px-4">{log.liters}</td>
                    <td className="py-2 px-4">${log.cost}</td>
                    <td className="py-2 px-4">{log.distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fuel Summary */}
          <h3 className="text-xl font-semibold text-cyan-300 mb-4">Fuel Summary (Per Vehicle)</h3>
          <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="py-2 px-4">Vehicle</th>
                  <th className="py-2 px-4">Total Liters</th>
                  <th className="py-2 px-4">Total Cost</th>
                  <th className="py-2 px-4">Total Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((sum) => (
                  <tr key={sum._id} className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-all duration-200">
                    <td className="py-2 px-4">{sum._id}</td>
                    <td className="py-2 px-4">{sum.totalLiters}</td>
                    <td className="py-2 px-4">${sum.totalCost}</td>
                    <td className="py-2 px-4">{sum.totalDistance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
