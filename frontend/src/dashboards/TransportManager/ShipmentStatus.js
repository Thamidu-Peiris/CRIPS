import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component

export default function ShipmentStatus() {
  const [shipments, setShipments] = useState([]);
  const [newShipment, setNewShipment] = useState({ shipmentId: '', vehicleId: '', driverId: '', departureDate: '' });

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    const res = await axios.get('http://localhost:5000/api/shipments');
    setShipments(res.data);
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`http://localhost:5000/api/shipments/${id}/status`, { status });
    fetchShipments();
  };

  const handleAddShipment = async () => {
    await axios.post('http://localhost:5000/api/shipments', newShipment);
    setNewShipment({ shipmentId: '', vehicleId: '', driverId: '', departureDate: '' });
    fetchShipments();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/shipments/${id}`);
    fetchShipments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
            Shipment Status Tracking
          </h2>

          {/* Add Shipment Form */}
          <div className="mb-8 flex space-x-4">
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Shipment ID"
              value={newShipment.shipmentId}
              onChange={(e) => setNewShipment({ ...newShipment, shipmentId: e.target.value })}
            />
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Vehicle ID"
              value={newShipment.vehicleId}
              onChange={(e) => setNewShipment({ ...newShipment, vehicleId: e.target.value })}
            />
            <input
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Driver ID"
              value={newShipment.driverId}
              onChange={(e) => setNewShipment({ ...newShipment, driverId: e.target.value })}
            />
            <input
              type="date"
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-400"
              value={newShipment.departureDate}
              onChange={(e) => setNewShipment({ ...newShipment, departureDate: e.target.value })}
            />
            <button
              onClick={handleAddShipment}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              Add Shipment
            </button>
          </div>

          {/* Shipments Table */}
          <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="py-2 px-4">Shipment ID</th>
                  <th className="py-2 px-4">Vehicle</th>
                  <th className="py-2 px-4">Driver</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Departure</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr
                    key={shipment._id}
                    className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-all duration-200"
                  >
                    <td className="py-2 px-4">{shipment.shipmentId}</td>
                    <td className="py-2 px-4">{shipment.vehicleId}</td>
                    <td className="py-2 px-4">{shipment.driverId}</td>
                    <td className="py-2 px-4">{shipment.status}</td>
                    <td className="py-2 px-4">{new Date(shipment.departureDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(shipment._id, 'In Transit')}
                        className="bg-yellow-500/80 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                      >
                        In Transit
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(shipment._id, 'Delivered')}
                        className="bg-green-500/80 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => handleDelete(shipment._id)}
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