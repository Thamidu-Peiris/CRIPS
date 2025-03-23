import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddSupplier() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/suppliers', form).then(() => {
        alert("Supplier Added!");
    navigate('/supplier');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Company Name" onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
      <input placeholder="Contact Person" onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} required />
      <input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} required />
      <input placeholder="Rating" type="number" min="1" max="10" onChange={(e) => setForm({ ...form, performanceRating: e.target.value })} />
      <button type="submit">submit</button>
    </form>
  );
}
