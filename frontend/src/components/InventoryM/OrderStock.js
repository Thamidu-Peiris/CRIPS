import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryNavbar from './InventoryNavbar';
import InventorySidebar from './InventorySidebar';
import { useNavigate } from 'react-router-dom';
import { FaTruck } from 'react-icons/fa';

export default function OrderStock() {
  const [category, setCategory] = useState('Seed');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('No userId found in localStorage');
      setAuthError('Please log in to place orders.');
      navigate('/login');
      return;
    }

    // Ensure userInfo exists for InventoryNavbar
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      console.log('No userInfo found in localStorage, setting default');
      localStorage.setItem('userInfo', JSON.stringify({ firstName: 'Inventory', lastName: 'Manager' }));
    }
  }, [navigate]);

  const handleFetchSuppliers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/order-stock/suppliers/${category}`);
      setSuppliers(res.data);
      setSelectedSupplier(null);
      setError('');
    } catch (err) {
      setError('❌ Failed to fetch suppliers');
      setSuppliers([]);
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inventoryManagerId = localStorage.getItem('userId');

    if (!selectedSupplier || !quantity || !unit || !deliveryDate || !inventoryManagerId) {
      setError('❌ All fields are required!');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      const orderPayload = {
        itemType: category,
        quantity: parseInt(quantity),
        unit,
        deliveryDate,
        supplierId: selectedSupplier._id,
        inventoryManagerId,
      };

      await axios.post('http://localhost:5000/api/order-stock/place-order', orderPayload);
      setSuccess('✅ Order Placed Successfully!');
      setError('');
      setQuantity('');
      setUnit('');
      setDeliveryDate('');
      setSelectedSupplier(null);
      setSuppliers([]);
      setTimeout(() => setSuccess(''), 3000); // Clear success after 3 seconds
    } catch (err) {
      console.error('Order Error:', err);
      setError('❌ Failed to place order');
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
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
        {success && (
          <div className="bg-green-100 text-green-800 font-semibold p-4 rounded mb-6 text-center max-w-7xl mx-auto">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 font-semibold p-4 rounded mb-6 text-center max-w-7xl mx-auto">
            {error}
          </div>
        )}

        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Order Low Stock 🌱</h2>

          {/* Category Selection */}
          <div className="mb-8">
            <label className="font-semibold text-green-800 block mb-2">Select Supply Category:</label>
            <div className="flex items-center gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 rounded border border-green-300 w-64 bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Seed">Seed</option>
                <option value="Fertilizer">Fertilizer</option>
                <option value="Cups">Cups</option>
                <option value="Media">Media</option>
              </select>
              <button
                onClick={handleFetchSuppliers}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded"
              >
                Fetch Suppliers
              </button>
            </div>
          </div>

          {/* Supplier Table */}
          {suppliers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">Available Suppliers</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border border-green-300">
                  <thead className="bg-green-700 text-white">
                    <tr>
                      <th className="p-4">Supplier Name</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr key={supplier._id} className="text-center border-b hover:bg-green-50">
                        <td className="p-4">{supplier.name || 'N/A'}</td>
                        <td className="p-4">{supplier.companyName || 'N/A'}</td>
                        <td className="p-4">{supplier.email || 'N/A'}</td>
                        <td className="p-4">{supplier.contactNumber || 'N/A'}</td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedSupplier(supplier)}
                            className={`${
                              selectedSupplier?._id === supplier._id
                                ? 'bg-green-700 text-white'
                                : 'bg-green-500 text-white'
                            } px-4 py-2 rounded hover:bg-green-600 font-semibold`}
                          >
                            {selectedSupplier?._id === supplier._id ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Form */}
          {selectedSupplier && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-800">Place Order for {selectedSupplier.name}</h3>

              <div>
                <label className="block text-green-800 font-semibold mb-2">Quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="1"
                  className="p-3 border border-green-300 rounded w-full bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-green-800 font-semibold mb-2">Unit (kg/pack/etc):</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className="p-3 border border-green-300 rounded w-full bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-green-800 font-semibold mb-2">Delivery Date:</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="p-3 border border-green-300 rounded w-full bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded flex items-center gap-2"
              >
                <FaTruck /> Submit Order
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}