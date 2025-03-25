import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../InventoryM/Navbar';
import '../InventoryM/styles.css';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch approved suppliers on load
  useEffect(() => {
    fetchApprovedSuppliers();
  }, []);

  const fetchApprovedSuppliers = () => {
    axios.get('http://localhost:5000/api/suppliers')
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error('Error fetching suppliers:', err));
  };

  // ✅ Search filter with safe optional chaining
  const filteredSuppliers = suppliers.filter((s) =>
    s?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s?.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="supplier-container">
        <h2 className="page-title">🌿 Approved Suppliers List 🌿</h2>

        {/* ✅ Search Bar */}
        <div className="supplier-actions">
          <input
            type="text"
            placeholder="🔍 Search Supplier"
            className="supplier-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Supplier Table */}
        <table className="supplier-table">
          <thead>
            <tr>
              <th>Supplier NIC</th>
              <th>Supplier Name</th>
              <th>Company</th>
              <th>Contact Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {filteredSuppliers.map((supplier, index) => (
    <tr key={supplier._id}>
      <td>SUP_{index + 1}</td>
      <td>{supplier.name}</td>
      <td>{supplier.companyName}</td>
      <td>{supplier.contactNumber}</td>
      <td style={{ color: supplier.status === 'approved' ? 'green' : 'red', fontWeight: "600" }}>
        {supplier.status}
      </td>
    </tr>
  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
