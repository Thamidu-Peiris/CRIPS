import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

export default function StockList() {
  const [stocks, setStocks] = useState([]);

  const fetchStocks = () => {
    axios.get('http://localhost:5000/api/stocks').then((res) => setStocks(res.data));
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const deleteStock = (id) => {
    axios.delete(`http://localhost:5000/api/stocks/${id}`).then(() => fetchStocks());
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <button onClick={() => window.location.href = '/add-stock'}>+ New Stock</button>
      <table border="1">
        <thead><tr><th>Stock ID</th><th>Plant Name</th><th>Quantity</th><th>Expiration Date</th><th>Actions</th></tr></thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock._id}>
              <td>{stock._id}</td>
              <td>{stock.plantName}</td>
              <td>{stock.quantity}</td>
              <td>{new Date(stock.expirationDate).toLocaleDateString()}</td>
              <td><button onClick={() => deleteStock(stock._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
