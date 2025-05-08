// frontend\src\dashboards\TransportManager\ShipmentScheduler.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component


export default function ShipmentScheduler() {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ shipmentId: '', vehicleId: '', driverId: '', departureDate: '' });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const res = await axios.get('http://localhost:5000/api/schedules');
    setSchedules(res.data);
  };

  const handleCompleteAndMove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/shipments/scheduler/${id}/complete`, {
        expectedArrivalDate: "2025-04-01"  // Optional: You can add input to collect this
      });
      console.log("✅ Shipment moved to Shipment Status");
      fetchSchedules(); // Refresh scheduler after move
    } catch (err) {
      console.error("❌ Move failed:", err.response?.data || err);
    }
  };

  const handleAddSchedule = async () => {
    await axios.post('http://localhost:5000/api/schedules', newSchedule);
    setNewSchedule({ shipmentId: '', vehicleId: '', driverId: '', departureDate: '' });
    fetchSchedules();
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`http://localhost:5000/api/schedules/${id}/status`, { status });
    fetchSchedules();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/schedules/${id}`);
    fetchSchedules();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
            Shipment Scheduling
          </h2>

          {/* Add Schedule Form */}
          <div className="mb-8 flex space-x-4">
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Shipment ID"
              value={newSchedule.shipmentId}
              onChange={(e) => setNewSchedule({ ...newSchedule, shipmentId: e.target.value })}
            />
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Vehicle ID"
              value={newSchedule.vehicleId}
              onChange={(e) => setNewSchedule({ ...newSchedule, vehicleId: e.target.value })}
            />
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Driver ID"
              value={newSchedule.driverId}
              onChange={(e) => setNewSchedule({ ...newSchedule, driverId: e.target.value })}
            />
            <input
              type="date"
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-400"
              value={newSchedule.departureDate}
              onChange={(e) => setNewSchedule({ ...newSchedule, departureDate: e.target.value })}
            />
            <button
              onClick={handleAddSchedule}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              Schedule
            </button>
          </div>

          {/* Schedule Table */}
          <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="py-2 px-4">Shipment</th>
                  <th className="py-2 px-4">Vehicle</th>
                  <th className="py-2 px-4">Driver</th>
                  <th className="py-2 px-4">Departure</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr
                    key={schedule._id}
                    className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-all duration-200"
                  >
                    <td className="py-2 px-4">{schedule.shipmentId}</td>
                    <td className="py-2 px-4">{schedule.vehicleId}</td>
                    <td className="py-2 px-4">{schedule.driverId}</td>
                    <td className="py-2 px-4">{new Date(schedule.departureDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{schedule.status}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(schedule._id, 'In Progress')}
                        className="bg-yellow-500/80 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                      >
                        Start
                      </button>
                      <button
                  onClick={() => handleCompleteAndMove(schedule._id)}
                   className="bg-green-500/80 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
>
                  Complete & Move
                      </button>
                      <button
                        onClick={() => handleDelete(schedule._id)}
                        className="bg-red-500/80 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </td>
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