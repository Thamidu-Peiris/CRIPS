import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaClipboardCheck } from 'react-icons/fa';

export default function QualityCheckLog() {
  const [shipmentId, setShipmentId] = useState('');
  const [shipments, setShipments] = useState([]);
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
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Quality Check Logs
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Log and review quality checks for delivered shipments
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          {/* Shipment Selector */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-600 font-semibold">Select Shipment ID</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
              <p>{error}</p>
            </div>
          )}

          {/* Quality Check Form - Redesigned as a Card */}
          <div className="mb-8 bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
            <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <FaClipboardCheck className="mr-2 text-green-500" />
              Log Quality Check
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Condition</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  disabled={!shipmentId || isLoading}
                >
                  <option value="Intact">Intact</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 font-semibold mb-1">Remarks (optional)</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Remarks (optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={!shipmentId || isLoading}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleLogQuality}
                disabled={!shipmentId || isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Logging...' : 'Log Check'}
              </button>
            </div>
          </div>

          {/* Quality Logs Table */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Quality Logs</h3>
            {isLoading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-gray-600 text-center">No quality logs available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-gray-800 font-semibold">Date</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Condition</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr
                        key={log._id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                      >
                        <td className="py-3 px-4">{new Date(log.checkDate).toLocaleDateString()}</td>
                        <td
                          className={`py-3 px-4 ${
                            log.condition === 'Damaged' ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {log.condition}
                        </td>
                        <td className="py-3 px-4">{log.remarks || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}