/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryNavbar from '../InventoryM/InventoryNavbar';
import InventorySidebar from '../InventoryM/InventorySidebar';
import { useNavigate } from 'react-router-dom';

export default function SupplierForm() {
  const [form, setForm] = useState({
    companyName: '',
    plantId: '',
    plantName: '',
    quantity: '',
    location: '',
    payment: '',
  });
  const [message, setMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("No userId found in localStorage");
      setAuthError("Please log in to add a supplier.");
      navigate("/login");
      return;
    }

    // Ensure userInfo exists for InventoryNavbar
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      console.log("No userInfo found in localStorage, setting default");
      localStorage.setItem("userInfo", JSON.stringify({ firstName: "Inventory", lastName: "Manager" }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.plantId || !form.plantName || !form.quantity || !form.location || !form.payment) {
      setMessage('All fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/suppliers', form);
      setMessage('✅ Supplier Added Successfully');
      setTimeout(() => navigate('/inventory/suppliers'), 1500); // Delay redirect for message visibility
      setForm({
        companyName: '',
        plantId: '',
        plantName: '',
        quantity: '',
        location: '',
        payment: '',
      });
    } catch (err) {
      console.error('Error adding supplier:', err);
      setMessage('Failed to Add Supplier');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <InventorySidebar />
      <div className="flex-1 ml-72">
        <InventoryNavbar />
        <div className="p-6">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Supplier Registration Form 🌱</h2>

            {authError && (
              <div className="bg-red-200 text-red-900 font-semibold p-4 rounded mb-4">
                {authError}
              </div>
            )}
            {message && (
              <div className={`mb-4 p-3 rounded text-center font-semibold ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-green-800 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-green-800 mb-1">Plant ID</label>
                <input
                  type="text"
                  name="plantId"
                  placeholder="Enter plant ID"
                  value={form.plantId}
                  onChange={handleChange}
                  className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-green-800 mb-1">Plant Name</label>
                <input
                  type="text"
                  name="plantName"
                  placeholder="Enter plant name"
                  value={form.plantName}
                  onChange={handleChange}
                  className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-green-800 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-green-800 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-green-800 mb-1">Payment</label>
                <input
                  type="text"
                  name="payment"
                  placeholder="Enter payment details"
                  value={form.payment}
                  onChange={handleChange}
                  className="w-full p-3 border border-green-300 rounded bg-green-50 text-green-900"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}