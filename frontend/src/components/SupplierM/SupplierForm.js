import { useState } from 'react';
import axios from 'axios';
import Navbar from '../InventoryM/Navbar';
import { useNavigate } from 'react-router-dom';

export default function SupplierForm() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/suppliers', form).then(() => navigate('/suppliers'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h2>Supplier Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Company Name" onChange={(e) => setForm({ ...form, companyName: e.target.value })} /><br />
        <input placeholder="Plant ID" onChange={(e) => setForm({ ...form, plantId: e.target.value })} /><br />
        <input placeholder="Plant Name" onChange={(e) => setForm({ ...form, plantName: e.target.value })} /><br />
        <input placeholder="Quantity" type="number" onChange={(e) => setForm({ ...form, quantity: e.target.value })} /><br />
        <input placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} /><br />
        <input placeholder="Payment" onChange={(e) => setForm({ ...form, payment: e.target.value })} /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
