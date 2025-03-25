import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Navbar from './Navbar';
import './styles.css';

export default function Dashboard() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // ✅ Fetch Stocks and Suppliers
  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks').then(res => setStocks(res.data));
    axios.get('http://localhost:5000/api/suppliers').then(res => setSuppliers(res.data));
  }, []);

  // ✅ Initialize Chart
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
            backgroundColor: ['#66bb6a', '#81c784']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }, [stocks, suppliers]);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container plant-theme">
        <h1 className="dashboard-title">🌿 Plant Inventory Dashboard 🌱</h1>

        {/* ✅ Chart Section */}
        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>

        {/* ✅ Stock Alert Table */}
        <h3 className="section-title">🌱 Stock Alert (Quantity &lt; 40)</h3>
        <table className="dashboard-table">
          <thead>
            <tr><th>Stock ID</th><th>Plant Name</th><th>Quantity</th><th>Status</th></tr>
          </thead>
          <tbody>
            {stocks.map((s, index) => (
              <tr key={s._id}>
                <td>STOCK_{index + 1}</td>
                <td>{s.plantName}</td>
                <td>{s.quantity}</td>
                <td style={{ color: s.quantity < 40 ? '#d32f2f' : '#388e3c' }}>
                  {s.quantity < 40 ? '🌱 Low Stock' : '✅ Healthy'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Top Providing Products */}
        <h3 className="section-title">🌿 Top Providing Plants</h3>
        <table className="dashboard-table">
          <thead>
            <tr><th>Plant ID</th><th>Quantity</th><th>Plant Name</th></tr>
          </thead>
          <tbody>
            {stocks.sort((a, b) => b.quantity - a.quantity).slice(0, 5).map((s) => (
              <tr key={s._id}>
                <td>{s.plantId}</td>
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
