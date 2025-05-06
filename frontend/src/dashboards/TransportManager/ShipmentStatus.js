import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaShippingFast } from 'react-icons/fa';

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
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Shipment Status Tracking
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Monitor and update the status of shipments
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          {/* Add Shipment Form - Redesigned as a Card */}
          <div className="mb-8 bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
              <FaShippingFast className="mr-2 text-green-500" />
              Add New Shipment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Shipment ID</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Shipment ID"
                  value={newShipment.shipmentId}
                  onChange={(e) => setNewShipment({ ...newShipment, shipmentId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Vehicle ID</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Vehicle ID"
                  value={newShipment.vehicleId}
                  onChange={(e) => setNewShipment({ ...newShipment, vehicleId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Driver ID</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Driver ID"
                  value={newShipment.driverId}
                  onChange={(e) => setNewShipment({ ...newShipment, driverId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Departure Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newShipment.departureDate}
                  onChange={(e) => setNewShipment({ ...newShipment, departureDate: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddShipment}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                >
                  Add Shipment
                </button>
              </div>
            </div>
          </div>

          {/* Shipments Table */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Shipment Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-800 font-semibold">Shipment ID</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Vehicle</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Driver</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Status</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Departure</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment) => (
                    <tr
                      key={shipment._id}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                    >
                      <td className="py-3 px-4">{shipment.shipmentId}</td>
                      <td className="py-3 px-4">{shipment.vehicleId}</td>
                      <td className="py-3 px-4">{shipment.driverId}</td>
                      <td className="py-3 px-4">{shipment.status}</td>
                      <td className="py-3 px-4">{new Date(shipment.departureDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(shipment._id, 'In Transit')}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                        >
                          In Transit
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(shipment._id, 'Delivered')}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200"
                        >
                          Delivered
                        </button>
                        <button
                          onClick={() => handleDelete(shipment._id)}
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