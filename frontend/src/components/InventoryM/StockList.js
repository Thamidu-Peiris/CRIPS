import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function StockList() {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = () => {
    axios.get('http://localhost:5000/api/stocks')
      .then((res) => setStocks(res.data))
      .catch((err) => console.error('Error fetching stocks:', err));
  };

  // ✅ Delete function fixed with backticks
  const deleteStock = (id) => {
    axios.delete(`http://localhost:5000/api/stocks/${id}`)
      .then(() => fetchStocks())
      .catch((err) => console.error('Error deleting stock:', err));
  };

  const handleAddStock = () => {
    navigate('/add-stock');
  };

  const startEditing = (stock) => {
    setEditingStock(stock);
    setUpdatedQuantity(stock.quantity);
  };

  const saveUpdate = (id) => {
    axios.put(`http://localhost:5000/api/stocks/${id}`, { quantity: updatedQuantity })
      .then(() => {
        fetchStocks();
        setEditingStock(null);
      })
      .catch((err) => console.error('Error updating stock:', err));
  };

  return (
    <div>
      <Navbar />
      <div className="stock-container">
        <h2 className="page-title">🌱 In Stock - Plant Inventory 🌱</h2>

        <button className="add-stock-btn" onClick={handleAddStock}>+ New Stock</button>

        {stocks.length === 0 ? (
          <p className="no-stock">No stock available.</p>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Plant Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {stocks.map((stock, index) => (
                <tr key={stock._id}>
                  {/* ✅ Auto-generated Stock ID */}
                  <td>STOCK_{index + 1}</td>
                  <td>{stock.plantName}</td>
                  <td>{stock.category}</td>
                  <td>
                    {editingStock?._id === stock._id ? (
                      <input
                        type="number"
                        value={updatedQuantity}
                        onChange={(e) => setUpdatedQuantity(e.target.value)}
                      />
                    ) : (
                      stock.quantity
                    )}
                  </td>
                  <td>{new Date(stock.expirationDate).toLocaleDateString()}</td>
                  <td>
                    {editingStock?._id === stock._id ? (
                      <button className="update-btn" onClick={() => saveUpdate(stock._id)}>Save</button>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => startEditing(stock)}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteStock(stock._id)}>Delete</button>
                      </>
                    )}
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
