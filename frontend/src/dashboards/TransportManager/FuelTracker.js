import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaGasPump } from 'react-icons/fa';

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
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Fuel Consumption Tracker
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Track and manage fuel usage for your fleet
          </p>
        </header>

        {/* Add Fuel Log Form - Redesigned as a Card */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
            <FaGasPump className="mr-2 text-green-500" />
            Add Fuel Log
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Vehicle ID</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Vehicle ID"
                value={log.vehicleId}
                onChange={(e) => setLog({ ...log, vehicleId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Liters</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Liters"
                value={log.liters}
                onChange={(e) => setLog({ ...log, liters: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Cost</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Cost"
                value={log.cost}
                onChange={(e) => setLog({ ...log, cost: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Distance (km)</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Distance (km)"
                value={log.distance}
                onChange={(e) => setLog({ ...log, distance: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddLog}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
              >
                Add Log
              </button>
            </div>
          </div>
        </div>

        {/* Fuel Logs Table */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-green-900 mb-4">All Fuel Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-gray-800 font-semibold">Date</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Vehicle</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Liters</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Cost</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                    <td className="py-3 px-4">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{log.vehicleId}</td>
                    <td className="py-3 px-4">{log.liters}</td>
                    <td className="py-3 px-4">${log.cost}</td>
                    <td className="py-3 px-4">{log.distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fuel Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-green-900 mb-4">Fuel Summary (Per Vehicle)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-gray-800 font-semibold">Vehicle</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Total Liters</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Total Cost</th>
                  <th className="py-3 px-4 text-gray-800 font-semibold">Total Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((sum) => (
                  <tr key={sum._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                    <td className="py-3 px-4">{sum._id}</td>
                    <td className="py-3 px-4">{sum.totalLiters}</td>
                    <td className="py-3 px-4">${sum.totalCost}</td>
                    <td className="py-3 px-4">{sum.totalDistance}</td>
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