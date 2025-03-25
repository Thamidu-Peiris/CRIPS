import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../InventoryM/Navbar';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch only approved suppliers
    axios.get('http://localhost:5000/api/suppliers/approved')
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error('Error fetching suppliers:', err));
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-green-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
        <h2 className="text-4xl font-bold text-green-800 text-center mb-8">🌿 Approved Supplier List 🌿</h2>

        {/* Search Bar */}
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="🔍 Search Supplier by Company Name"
            className="w-1/3 p-3 border border-green-400 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredSuppliers.length === 0 ? (
          <p className="text-center text-lg font-semibold">No approved suppliers found.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-4">Supplier ID</th>
                <th>Supplier Name</th>
                <th>Company</th>
                <th>Contact Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id} className="text-center border-b">
                  <td>SUP_{index + 1}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.companyName}</td>
                  <td>{supplier.contactNumber}</td>
                  <td className="font-semibold text-green-700">{supplier.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
