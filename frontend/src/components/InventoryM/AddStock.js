import { useState } from 'react';
import axios from 'axios';

export default function AddStock() {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/stocks', form);
    alert('Stock Added!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Plant ID" onChange={(e) => setForm({ ...form, plantId: e.target.value })} />
      <input placeholder="Plant Name" onChange={(e) => setForm({ ...form, plantName: e.target.value })} />
      <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input placeholder="Quantity" type="number" onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
      <input placeholder="Expiration Date" type="date" onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} />
      <input placeholder="Status" onChange={(e) => setForm({ ...form, status: e.target.value })} />
      <button type="submit">Add Stock</button>
    </form>
  );
}
