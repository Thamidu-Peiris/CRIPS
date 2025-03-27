import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks').then(res => setStocks(res.data));
    axios.get('http://localhost:5000/api/suppliers').then(res => setSuppliers(res.data));
  }, []);

  useEffect(() => {
    if (chartRef.current && stocks.length && suppliers.length) {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
      const stockTotal = stocks.reduce((sum, s) => sum + s.quantity, 0);
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Total Stock Quantity', 'Total Suppliers'],
          datasets: [{
            label: 'Inventory Overview',
            data: [stockTotal, suppliers.length],
            backgroundColor: ['#4caf50', '#81c784']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
      });
    }
  }, [stocks, suppliers]);

  return (
    <div className="bg-green-50 min-h-screen pl-48">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-green-800 text-center mb-8">🌿 Plant Inventory Dashboard 🌱</h1>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <canvas ref={chartRef} className="w-full h-80"></canvas>
        </div>

        {/* Stock Alerts Section */}
        <h3 className="text-3xl font-bold text-green-700 mb-4">🌱 Stock Alert</h3>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-4">Stock ID</th>
              <th>Plant Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, index) => (
              <tr key={s._id} className="text-center border-b">
                <td>STOCK_{index + 1}</td>
                <td>{s.plantName}</td>
                <td>{s.quantity}</td>
                <td className={`${s.quantity < 40 ? 'text-red-600' : 'text-green-700'}`}>
                  {s.quantity < 40 ? '🌱 Low Stock' : '✅ Stock'}
                </td>
                <td>
                  {s.quantity < 40 && (
                    <button
                      onClick={() => navigate('/order-low-stocks')}
                      className="bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                    >
                      Order Low Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Top Providing Products */}
        <h3 className="text-3xl font-bold text-green-700 mt-10 mb-4">🌿 Top Providing Plants</h3>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-4">Stock ID</th>
              <th>Quantity</th>
              <th>Plant Name</th>
            </tr>
          </thead>
          <tbody>
            {stocks
              .filter(s => s.quantity > 30)
              .sort((a, b) => b.quantity - a.quantity)
              .slice(0, 5)
              .map((s, index) => (
                <tr key={s._id} className="text-center border-b">
                  <td>STOCK_{index + 1}</td>
                  <td>{s.quantity}</td>
                  <td>{s.plantName}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
