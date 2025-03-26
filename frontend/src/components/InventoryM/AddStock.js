import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

export default function AddStock() {
  const [form, setForm] = useState({ plantName: '', category: '', quantity: '', expirationDate: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.quantity <= 0) return alert("Quantity must be greater than 0");
    axios.post('http://localhost:5000/api/stocks', form)
      .then(() => {
        alert("✅ Stock added successfully!");
        navigate('/in-stock');
      }).catch(err => console.error(err));
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <Navbar />
      <div className="bg-white rounded-xl shadow-lg max-w-xl mx-auto mt-10 p-8">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Add New Stock 🌿</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-green-800 mb-1">Plant Name:</label>
            <input type="text" className="w-full p-3 border rounded" placeholder="Enter Plant Name"
              value={form.plantName} onChange={(e) => setForm({ ...form, plantName: e.target.value })} required />
          </div>
          <div>
            <label className="block font-semibold text-green-800 mb-1">Category:</label>
            <input type="text" className="w-full p-3 border rounded" placeholder="Enter Category"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          </div>
          <div>
            <label className="block font-semibold text-green-800 mb-1">Quantity (in units):</label>
            <input type="number" min="1" className="w-full p-3 border rounded" placeholder="Enter Quantity"
              value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="block font-semibold text-green-800 mb-1">Expiration Date:</label>
            <input type="date" className="w-full p-3 border rounded"
              value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} required />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded">Add Stock</button>
        </form>
      </div>
    </div>
  );
}
