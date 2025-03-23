import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../InventoryM/Navbar';
import '../InventoryM/styles.css';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/api/suppliers')
      .then((res) => setSuppliers(res.data));
  }, []);

  // Filtered suppliers for search
  const filteredSuppliers = suppliers.filter((s) =>
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.plantName.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="supplier-container">
      <Navbar />
      <h2>Suppliers List</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Quick search"
        className="supplier-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add Supplier Button */}
      <button className="add-supplier-btn">+ New Suppliers</button>

      {/* Supplier Table */}
      <table className="supplier-table">
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Plant ID</th>
            <th>Plant Name</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((s, index) => (
            <tr key={s._id}>
              <td>{index + 1}</td>
              <td>{s.companyName}</td>
              <td>#{s.plantId}</td>
              <td>{s.plantName}</td>
              <td>{s.quantity}</td>
              <td>{s.location}</td>
              <td style={{ fontWeight: "600" }}>{s.payment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Button */}
      <button className="update-btn">Update Supplier details</button>
    </div>
  );
}
