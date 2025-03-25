import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/InventoryM/Navbar'; // Same as the desired Navbar
import { useNavigate } from 'react-router-dom';
import { FaTruck } from 'react-icons/fa';
import '../../components/InventoryM/styles.css'; // Same CSS file as StockList

const OrderStock = () => {
  const [category, setCategory] = useState('Seed');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null); // Store the full supplier object
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch suppliers when category changes or on button click
  const handleFetchSuppliers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/order-stock/suppliers/${category}`);
      setSuppliers(res.data);
      setError('');
      setSelectedSupplier(null); // Reset selected supplier when fetching new suppliers
    } catch (err) {
      setError('Failed to fetch suppliers');
      setSuppliers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // ✅ Get the inventory manager ID from localStorage
    const inventoryManagerId = localStorage.getItem('userId');
  
    if (!selectedSupplier || !quantity || !unit || !deliveryDate || !inventoryManagerId) {
      setError('All fields are required including manager ID');
      return;
    }
  
    try {
      const orderPayload = {
        itemType: category,
        quantity: parseInt(quantity),
        unit,
        deliveryDate,
        supplierId: selectedSupplier._id,
        inventoryManagerId: inventoryManagerId // ✅ Correct MongoDB ObjectId
      };
  
      const res = await axios.post('http://localhost:5000/api/order-stock/place-order', orderPayload);
      setSuccess('Order Placed Successfully!');
      setError('');
      console.log("Order Response:", res.data);
    } catch (err) {
      console.error("Order Error:", err);
      setError('Failed to place order');
    }
  };

  return (
    <div>
      {/* Use the same Navbar as StockList */}
      <Navbar />

      <div className="stock-container">
        {/* Plant-themed title similar to StockList */}
        <h2 className="page-title">🌱 Order Stock - Plant Inventory 🌱</h2>

        {/* Display success or error messages */}
        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}

        {/* Category Selection */}
        <div className="category-selector mb-6">
          <label className="block mb-2 text-lg">Select Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded text-black"
          >
            <option value="Seed">Seed</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Cups">Cups</option>
            <option value="Media">Media</option>
          </select>
          <button
            onClick={handleFetchSuppliers}
            className="ml-4 add-stock-btn" // Use same button style as StockList
          >
            Fetch Suppliers
          </button>
        </div>

        {/* Suppliers Table (similar to StockList table) */}
        {suppliers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl mb-4">Suppliers offering {category}:</h3>
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.companyName}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.contactNumber}</td>
                    <td>
                      <button
                        onClick={() => setSelectedSupplier(supplier)}
                        className={`${
                          selectedSupplier?._id === supplier._id ? 'update-btn' : 'edit-btn'
                        }`}
                      >
                        {selectedSupplier?._id === supplier._id ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Form (only shown if a supplier is selected) */}
        {selectedSupplier && (
          <form onSubmit={handleSubmit} className="stock-form">
            <h3 className="text-xl mb-4">Place Order for {selectedSupplier.name}</h3>
            <div className="mb-4">
              <label className="block mb-2">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="p-2 text-black rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Unit (kg/pack/etc):</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                className="p-2 text-black rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Delivery Date:</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
                className="p-2 text-black rounded w-full"
              />
            </div>
            <button type="submit" className="add-stock-btn flex items-center">
              <FaTruck className="mr-2" /> Submit Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderStock;