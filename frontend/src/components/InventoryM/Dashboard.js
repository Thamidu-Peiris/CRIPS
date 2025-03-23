import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Navbar from './Navbar';


export default function Dashboard() {
  const chartRef = useRef(null);   // Canvas Reference
  const chartInstanceRef = useRef(null); // Chart Instance Reference
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks').then(res => setStocks(res.data));
    axios.get('http://localhost:5000/api/suppliers').then(res => setSuppliers(res.data));
  }, []);

  useEffect(() => {
    if (stocks.length && suppliers.length && chartRef.current) {
      // Destroy old chart instance if exists
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();

      // Create new chart instance
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Total Stock Quantity', 'Total Suppliers'],
          datasets: [{
            label: 'Inventory Overview',
            data: [stocks.reduce((sum, s) => sum + s.quantity, 0), suppliers.length],
            backgroundColor: ['#4e73df', '#1cc88a']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }, [stocks, suppliers]);

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h1>Inventory Management Dashboard</h1>

      <div style={{ width: '80%', height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>

      <h3>Stock Alert (Quantity &lt; 40)</h3>
      <table border="1">
        <thead><tr><th>Stock ID</th><th>Plant Name</th><th>Quantity</th><th>Status</th></tr></thead>
        <tbody>
          {stocks.map(s => (
            <tr key={s._id}>
              <td>{s._id}</td>
              <td>{s.plantName}</td>
              <td>{s.quantity}</td>
              <td style={{ color: s.quantity < 40 ? 'red' : 'green' }}>
                {s.quantity < 40 ? 'Out of Stock' : 'Available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Top Providing Products</h3>
      <table border="1">
        <thead><tr><th>Plant ID</th><th>Quantity</th><th>Plant Name</th></tr></thead>
        <tbody>
          {stocks.sort((a, b) => b.quantity - a.quantity).slice(0, 5).map((s) => (
            <tr key={s._id}><td>{s.plantId}</td><td>{s.quantity}</td><td>{s.plantName}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
