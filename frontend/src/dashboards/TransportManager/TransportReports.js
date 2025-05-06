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
import Sidebar from './Sidebar';

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
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // Green accent
        borderColor: 'rgba(34, 197, 94, 1)',
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
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // Green accent
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#374151', // Dark gray for text
          font: { size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#374151', font: { size: 12 } },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      y: {
        ticks: { color: '#374151', font: { size: 12 } },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Transport Reports
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Visualize shipment and fuel cost summaries
          </p>
        </header>

        <div className="space-y-8">
          {/* Shipment Summary Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Shipment Summary</h3>
            <div className="h-64">
              <Bar data={shipmentChart} options={chartOptions} />
            </div>
          </div>

          {/* Fuel Cost Summary Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Fuel Cost Summary</h3>
            <div className="h-64">
              <Line data={fuelChart} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}