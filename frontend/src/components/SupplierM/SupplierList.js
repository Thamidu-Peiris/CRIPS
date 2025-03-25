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

  const filteredSuppliers = suppliers.filter((s) =>
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.plantName.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="supplier-container">
        <h2 className="page-title">🌿 Suppliers List 🌿</h2>

        {/* Search and Add */}
        <div className="supplier-actions">
          <input
            type="text"
            placeholder="🔍 Search Suppliers"
            className="supplier-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-supplier-btn">+ New Suppliers</button>
        </div>

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
                <td>SUP_{index + 1}</td>
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
        <button className="update-btn">Update Supplier Details</button>
      </div>
    </div>
  );
}
