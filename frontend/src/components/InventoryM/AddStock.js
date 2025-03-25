import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function AddStock() {
  const [form, setForm] = useState({
    plantName: '',
    category: '',
    quantity: '',
    expirationDate: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    axios.post('http://localhost:5000/api/stocks', form)
      .then(() => {
        alert("✅ Stock added successfully!");
        navigate('/in-stock'); // ✅ Navigate to In-Stock after adding
      })
      .catch((err) => console.error('Error adding stock:', err));
  };

  return (
    <div>
      <Navbar />
      <div className="add-stock-container">
        <h2 className="page-title">🌿 Add New Stock 🌿</h2>
        <form onSubmit={handleSubmit}>

          <label className="input-label">Plant Name:</label>
          <input
            placeholder="Enter Plant Name"
            value={form.plantName}
            onChange={(e) => setForm({ ...form, plantName: e.target.value })}
            required
          />

          <label className="input-label">Category:</label>
          <input
            placeholder="Enter Category (e.g., Flowering, Herbal)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <label className="input-label">Quantity (in units):</label>
          <input
            placeholder="Enter Quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            required
          />

          <label className="input-label">Expiration Date:</label>
          <input
            type="date"
            value={form.expirationDate}
            onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
            required
          />

          <button type="submit">Add Stock</button>
        </form>
      </div>
    </div>
  );
}
