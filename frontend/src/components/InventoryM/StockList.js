import { useEffect, useState } from 'react';
import axios from 'axios';
import InventoryNavbar from './InventoryNavbar';
import InventorySidebar from './InventorySidebar';
import { useNavigate } from 'react-router-dom';

export default function StockList() {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [authError, setAuthError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("No userId found in localStorage");
      setAuthError("Please log in to view stocks.");
      navigate("/login");
      return;
    }

    // Ensure userInfo exists for InventoryNavbar
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      console.log("No userInfo found in localStorage, setting default");
      localStorage.setItem("userInfo", JSON.stringify({ firstName: "Inventory", lastName: "Manager" }));
    }

    fetchStocks();
  }, [navigate]);

  const fetchStocks = () => {
    axios.get('http://localhost:5000/api/stocks')
      .then((res) => setStocks(res.data))
      .catch((err) => {
        console.error('Error fetching stocks:', err);
        setMessage('Failed to fetch stocks');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      });
  };

  const deleteStock = (id) => {
    axios.delete(`http://localhost:5000/api/stocks/${id}`)
      .then(() => {
        setMessage('✅ Stock deleted successfully');
        fetchStocks();
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      })
      .catch((err) => {
        console.error('Error deleting stock:', err);
        setMessage('Failed to delete stock');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      });
  };

  const handleAddStock = () => {
    navigate('/add-stock');
  };

  const startEditing = (stock) => {
    setEditingStock(stock);
    setUpdatedQuantity(stock.quantity);
  };

  const saveUpdate = (id) => {
    if (!updatedQuantity || updatedQuantity < 0) {
      setMessage('Please enter a valid quantity');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      return;
    }

    axios.put(`http://localhost:5000/api/stocks/${id}`, { quantity: parseInt(updatedQuantity) })
      .then(() => {
        setMessage('✅ Stock updated successfully');
        fetchStocks();
        setEditingStock(null);
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      })
      .catch((err) => {
        console.error('Error updating stock:', err);
        setMessage('Failed to update stock');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <InventorySidebar />
      <main className="flex-1 p-6 ml-72">
        <InventoryNavbar />
        {authError && (
          <div className="bg-red-200 text-red-900 font-semibold p-4 rounded mb-6 text-center max-w-7xl mx-auto">
            {authError}
          </div>
        )}
        {message && (
          <div className={`mb-6 p-3 rounded text-center font-semibold ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} max-w-7xl mx-auto`}>
            {message}
          </div>
        )}

        <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-8">🌱 In Stock - Plant Inventory 🌱</h2>

          <div className="flex justify-end items-center mb-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
              onClick={handleAddStock}
            >
              + New Stock
            </button>
          </div>

          {stocks.length === 0 ? (
            <p className="text-center text-lg font-semibold text-green-800">No stock available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-green-300">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="p-4">Stock ID</th>
                    <th className="p-4">Plant Name</th>
                    <th className="p-4">Price ($)</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Expiration Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, index) => (
                    <tr key={stock._id} className="text-center border-b hover:bg-green-50">
                      <td className="p-4">STOCK_{index + 1}</td>
                      <td className="p-4">{stock.plantName || 'N/A'}</td>
                      <td className="p-4">{stock.itemPrice ? `$${stock.itemPrice.toFixed(2)}` : 'N/A'}</td>
                      <td className="p-4">
                        {editingStock?._id === stock._id ? (
                          <input
                            type="number"
                            value={updatedQuantity}
                            onChange={(e) => setUpdatedQuantity(e.target.value)}
                            className="w-24 p-2 border border-green-300 rounded bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                            min="0"
                          />
                        ) : (
                          stock.quantity
                        )}
                      </td>
                      <td className="p-4">{stock.expirationDate ? new Date(stock.expirationDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-4 flex justify-center gap-3">
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}