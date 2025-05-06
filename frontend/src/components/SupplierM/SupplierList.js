import { useEffect, useState } from 'react';
import axios from 'axios';
import InventoryNavbar from '../InventoryM/InventoryNavbar';
import InventorySidebar from '../InventoryM/InventorySidebar';
import { useNavigate } from 'react-router-dom';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [authError, setAuthError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('No userId found in localStorage');
      setAuthError('Please log in to view suppliers.');
      navigate('/login');
      return;
    }

    // Ensure userInfo exists for InventoryNavbar
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      console.log('No userInfo found in localStorage, setting default');
      localStorage.setItem('userInfo', JSON.stringify({ firstName: 'Inventory', lastName: 'Manager' }));
    }

    axios
      .get('http://localhost:5000/api/suppliers')
      .then((res) => setSuppliers(res.data))
      .catch((err) => {
        console.error('Error fetching suppliers:', err);
        setMessage('Failed to fetch suppliers');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      });
  }, [navigate]);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-200">
      <InventorySidebar />
      <main className="flex-1 p-6 ml-72">
        <InventoryNavbar />
        {authError && (
          <div className="bg-red-200 text-red-900 font-semibold p-4 rounded mb-6 text-center max-w-7xl mx-auto">
            {authError}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 rounded text-center font-semibold bg-red-100 text-red-800 max-w-7xl mx-auto">
            {message}
          </div>
        )}

        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Suppliers List 🌱</h2>

          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="🔍 Search by Company or Location"
              className="p-3 border border-green-300 rounded w-96 bg-green-50 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => navigate('/supplier-form')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded"
            >
              + New Supplier
            </button>
          </div>

          {filteredSuppliers.length === 0 ? (
            <p className="text-center text-lg font-semibold text-green-800">No suppliers available.</p>
          ) : (
            <div className="overflow-x-auto">
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
                      <td className="p-4">{s.name || 'N/A'}</td>
                      <td className="p-4">{s.companyName || 'N/A'}</td>
                      <td className="p-4">{s.contactNumber || 'N/A'}</td>
                      <td
                        className={`p-4 font-semibold ${
                          s.status === 'Approved' ? 'text-green-700' : 'text-red-600'
                        }`}
                      >
                        {s.status || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}