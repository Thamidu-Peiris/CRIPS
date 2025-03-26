import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

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
    <div className="bg-green-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
        <h2 className="text-4xl font-bold text-green-800 text-center mb-8">🌱 In Stock - Plant Inventory 🌱</h2>

        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mb-6"
          onClick={handleAddStock}
        >
          + New Stock
        </button>

        {stocks.length === 0 ? (
          <p className="text-center text-lg font-semibold">No stock available.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-4">Stock ID</th>
                <th>Plant Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr key={stock._id} className="text-center border-b">
                  <td>STOCK_{index + 1}</td>
                  <td>{stock.plantName}</td>
                  <td>{stock.category}</td>
                  <td>
                    {editingStock?._id === stock._id ? (
                      <input
                        type="number"
                        value={updatedQuantity}
                        onChange={(e) => setUpdatedQuantity(e.target.value)}
                        className="w-20 p-2 border rounded"
                      />
                    ) : (
                      stock.quantity
                    )}
                  </td>
                  <td>{new Date(stock.expirationDate).toLocaleDateString()}</td>
                  <td className="flex justify-center gap-2 mt-2">
                    {editingStock?._id === stock._id ? (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                        onClick={() => saveUpdate(stock._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-semibold"
                          onClick={() => startEditing(stock)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
                          onClick={() => deleteStock(stock._id)}
                        >
                          Delete
                        </button>
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
