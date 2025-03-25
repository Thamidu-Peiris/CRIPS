import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Navbar from './Navbar';
import './styles.css';
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

  // ✅ Render Chart
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
        <h3 className="section-title">🌱 Stock Alert</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ fontSize: '18px' }}>Stock ID</th>
              <th style={{ fontSize: '18px' }}>Plant Name</th>
              <th style={{ fontSize: '18px' }}>Quantity</th>
              <th style={{ fontSize: '18px' }}>Status</th>
              <th style={{ fontSize: '18px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, index) => (
              <tr key={s._id}>
                <td>STOCK_{index + 1}</td>
                <td>{s.plantName}</td>
                <td>{s.quantity}</td>
                <td style={{ color: s.quantity < 40 ? '#d32f2f' : '#388e3c' }}>
                  {s.quantity < 40 ? '🌱 Low Stock' : '✅ Stock'}
                </td>
                <td>
                  {s.quantity < 40 && (
                    <button className="order-btn" onClick={() => navigate('/order-low-stocks')}>
                      Order Low Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Top Providing Plants (Only if Quantity > 30) */}
        <h3 className="section-title">🌿 Top Providing Plants </h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ fontSize: '18px' }}>Stock ID</th>
              <th style={{ fontSize: '18px' }}>Quantity</th>
              <th style={{ fontSize: '18px' }}>Plant Name</th>
            </tr>
          </thead>
          <tbody>
            {stocks
              .filter((s) => s.quantity > 30)
              .sort((a, b) => b.quantity - a.quantity)
              .slice(0, 5)
              .map((s, index) => (
                <tr key={s._id}>
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
