import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import Sidebar from './Sidebar'; // Import the Sidebar component

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TransportReports() {
  const [shipmentData, setShipmentData] = useState([]);
  const [fuelData, setFuelData] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const shipmentRes = await axios.get('http://localhost:5000/api/reports/shipment-summary');
    const fuelRes = await axios.get('http://localhost:5000/api/reports/fuel-summary');
    setShipmentData(shipmentRes.data);
    setFuelData(fuelRes.data);
  };

  const shipmentChart = {
    labels: shipmentData.map(d => `Month ${d._id}`),
    datasets: [
      {
        label: 'Completed Shipments',
        data: shipmentData.map(d => d.count),
        backgroundColor: 'rgba(34, 211, 238, 0.7)', // Cyan accent
        borderColor: 'rgba(34, 211, 238, 1)',
        borderWidth: 1,
      },
    ],
  };

  const fuelChart = {
    labels: fuelData.map(d => `Month ${d._id}`),
    datasets: [
      {
        label: 'Fuel Cost (LKR)',
        data: fuelData.map(d => d.totalFuelCost),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // Green for contrast
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        tension: 0.4, // Smooth line
        fill: false,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb', // Light gray for text
          font: { size: 12 }, // Smaller legend text
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#e5e7eb', font: { size: 10 } }, // Smaller x-axis text
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#e5e7eb', font: { size: 10 } }, // Smaller y-axis text
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
            Transport Reports
          </h2>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">Shipment Summary</h3>
            <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner h-64">
              <Bar data={shipmentChart} options={chartOptions} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">Fuel Cost Summary</h3>
            <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner h-64">
              <Line data={fuelChart} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}