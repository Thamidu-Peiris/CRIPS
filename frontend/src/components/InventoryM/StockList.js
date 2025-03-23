import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

export default function StockList() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

 
  useEffect(() => {
    fetchStocks();
  }, []);

  
  const fetchStocks = () => {
    axios.get('http://localhost:5000/api/stocks')
      .then((res) => setStocks(res.data))
      .catch((err) => console.error('Error fetching stocks:', err));
  };

  
  const deleteStock = (id) => {
    axios.delete(`http://localhost:5000/api/stocks/${id}`)
      .then(() => fetchStocks())
      .catch((err) => console.error('Error deleting stock:', err));
  };

  
  const handleAddStock = () => {
    navigate('/add-stock');
  };

  return (
    <div>
    <Navbar />
    <div className="stock-container">
  <h2>In Stock</h2>
  <button className="add-stock-btn" onClick={handleAddStock}>+ New Stock</button>
      {stocks.length === 0 ? (
        <p>No stock available.</p>
      ) : (
        <table className="stock-table">
        <thead>
          <tr>
            <th>Stock ID</th>
            <th>Plant Name</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock._id}>
              <td>{stock._id}</td>
              <td>{stock.plantName}</td>
              <td>{stock.quantity}</td>
              <td>{new Date(stock.expirationDate).toLocaleDateString()}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteStock(stock._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>
  );
}
