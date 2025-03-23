import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function AddStock() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/stocks', form).then(() => navigate('/in-stock'));
  };

  return (
    <div>
    <Navbar />
    <div className="add-stock-container">
  <h2>Add New Stock</h2>
  <form onSubmit={handleSubmit}>
    <input placeholder="Plant ID" onChange={(e) => setForm({ ...form, plantId: e.target.value })} /><br />
    <input placeholder="Plant Name" onChange={(e) => setForm({ ...form, plantName: e.target.value })} /><br />
    <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} /><br />
    <input placeholder="Quantity" type="number" onChange={(e) => setForm({ ...form, quantity: e.target.value })} /><br />
    <input type="date" onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} /><br />
    <button type="submit">Add Stock</button>
  </form>
  </div>
</div>

  );
}
