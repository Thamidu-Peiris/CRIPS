import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/InventoryM/Navbar'; 
import { useNavigate } from 'react-router-dom';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/suppliers')
      .then((res) => setSuppliers(res.data));
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-green-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Suppliers List 🌿</h2>

        /* Search Bar */
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search by Company or Location"
            className="p-3 border border-green-300 rounded w-96 bg-green-100 text-green-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={() => navigate('/add-supplier')}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            + New Supplier
          </button>
        </div>

        {/* Supplier Table */}
        <table className="w-full border border-green-300 table-auto">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-4">Supplier ID</th>
              <th className="p-4">Supplier Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">Contact Number</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s, index) => (
              <tr key={s._id} className="text-center border-b hover:bg-green-50">
                <td className="p-4">SUP_{index + 1}</td>
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.companyName}</td>
                <td className="p-4">{s.contactNumber}</td>
                <td className={`p-4 font-semibold ${s.status === 'Approved' ? 'text-green-700' : 'text-red-600'}`}>
                  {s.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div> 
  );
}
