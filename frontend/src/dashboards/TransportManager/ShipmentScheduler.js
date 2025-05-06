import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaTruck } from 'react-icons/fa';

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
        expectedArrivalDate: "2025-04-01"
      });
      console.log("✅ Shipment moved to Shipment Status");
      fetchSchedules();
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
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Shipment Scheduling
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Schedule and manage shipments efficiently
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          {/* Add Schedule Form - Redesigned as a Card */}
          <div className="mb-8 bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
              <FaTruck className="mr-2 text-green-500" />
              Add New Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Shipment ID</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Shipment ID"
                  value={newSchedule.shipmentId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, shipmentId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Vehicle ID</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Vehicle ID"
                  value={newSchedule.vehicleId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, vehicleId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Driver ID</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Driver ID"
                  value={newSchedule.driverId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, driverId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Departure Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newSchedule.departureDate}
                  onChange={(e) => setNewSchedule({ ...newSchedule, departureDate: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddSchedule}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Scheduled Shipments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-800 font-semibold">Shipment</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Vehicle</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Driver</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Departure</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Status</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr
                      key={schedule._id}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                    >
                      <td className="py-3 px-4">{schedule.shipmentId}</td>
                      <td className="py-3 px-4">{schedule.vehicleId}</td>
                      <td className="py-3 px-4">{schedule.driverId}</td>
                      <td className="py-3 px-4">{new Date(schedule.departureDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{schedule.status}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(schedule._id, 'In Progress')}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => handleCompleteAndMove(schedule._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                        >
                          Complete & Move
                        </button>
                        <button
                          onClick={() => handleDelete(schedule._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
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
    </div>
  );
}