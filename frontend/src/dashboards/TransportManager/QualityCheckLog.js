import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

export default function QualityCheckLog() {
  const [shipmentId, setShipmentId] = useState('');
  const [shipments, setShipments] = useState([]); // NEW
  const [logs, setLogs] = useState([]);
  const [condition, setCondition] = useState('Intact');
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Delivered Shipments
  useEffect(() => {
    const fetchDeliveredShipments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/shipments/delivered');
        setShipments(res.data);
      } catch (err) {
        console.error('Failed to fetch delivered shipments:', err);
      }
    };
    fetchDeliveredShipments();
  }, []);

  useEffect(() => {
    if (!shipmentId) {
      setLogs([]);
      setError('Shipment ID is required to fetch quality logs. Please select a shipment.');
      return;
    }
    fetchLogs();
  }, [shipmentId]);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/quality/${shipmentId}`);
      setLogs(res.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch quality logs. Please try again later.');
      console.error('Failed to fetch quality logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogQuality = async () => {
    if (!shipmentId) {
      setError('Shipment ID is required to log a quality check. Please select a shipment.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/quality', {
        shipmentId,
        condition,
        remarks,
      });
      setCondition('Intact');
      setRemarks('');
      fetchLogs();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to log quality check. Please try again.');
      console.error('Failed to log quality check:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-72 p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
            Quality Check Logs
          </h2>

          {/* Shipment Selector */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Select Shipment ID</label>
            <select
              className="w-full bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={shipmentId}
              onChange={(e) => setShipmentId(e.target.value)}
            >
              <option value="">-- Select Shipment --</option>
              {shipments.map((shipment) => (
                <option key={shipment._id} value={shipment.shipmentId}>
                  {shipment.shipmentId}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-400 mb-6">{error}</div>
          )}

          {/* Quality Check Form */}
          <div className="mb-8 flex space-x-4">
            <select
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              disabled={!shipmentId || isLoading}
            >
              <option value="Intact">Intact</option>
              <option value="Damaged">Damaged</option>
            </select>
            <input
              className="flex-1 bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={!shipmentId || isLoading}
            />
            <button
              onClick={handleLogQuality}
              disabled={!shipmentId || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Logging...' : 'Log Check'}
            </button>
          </div>

          {/* Quality Logs Table */}
          <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner">
            {isLoading ? (
              <div className="text-center text-cyan-300">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-gray-400 text-center">No quality logs available.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Condition</th>
                    <th className="py-2 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-all duration-200"
                    >
                      <td className="py-2 px-4">{new Date(log.checkDate).toLocaleDateString()}</td>
                      <td
                        className={`py-2 px-4 ${
                          log.condition === 'Damaged' ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {log.condition}
                      </td>
                      <td className="py-2 px-4">{log.remarks || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
