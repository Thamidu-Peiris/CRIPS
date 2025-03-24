import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

export default function QualityCheckLog({ shipmentId }) {
  const [logs, setLogs] = useState([]);
  const [condition, setCondition] = useState('Intact');
  const [remarks, setRemarks] = useState('');

  const fetchLogs = async () => {
    const res = await axios.get(`http://localhost:5000/api/quality/${shipmentId}`);
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, [shipmentId, fetchLogs]); // Added fetchLogs to the dependency array

  const handleLogQuality = async () => {
    await axios.post('http://localhost:5000/api/quality', {
      shipmentId,
      condition,
      remarks,
    });
    setCondition('Intact');
    setRemarks('');
    fetchLogs();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />
      <div className="flex-1 ml-72 p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
            Quality Check Logs
          </h2>
          <div className="mb-8 flex space-x-4">
            <select
              className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="Intact">Intact</option>
              <option value="Damaged">Damaged</option>
            </select>
            <input
              className="flex-1 bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <button
              onClick={handleLogQuality}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              Log Check
            </button>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner">
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
                      className={
                        log.condition === 'Damaged' ? 'text-red-400' : 'text-green-400'
                      }
                    >
                      {log.condition}
                    </td>
                    <td className="py-2 px-4">{log.remarks}</td>
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