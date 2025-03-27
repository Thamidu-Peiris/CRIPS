import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <nav className="bg-green-900 py-5 px-10 flex justify-center gap-10 shadow-lg">
      <Link to="/inventrymanagerdashboard" className="text-white font-semibold text-lg px-4 py-2 rounded hover:bg-green-700">STOCK REPORTS</Link>
      <Link to="/in-stock" className="text-white font-semibold text-lg px-4 py-2 rounded hover:bg-green-700">IN STOCK</Link>
      <Link to="/add-stock" className="text-white font-semibold text-lg px-4 py-2 rounded hover:bg-green-700">ADD STOCK</Link>
      <Link to="/suppliers" className="text-white font-semibold text-lg px-4 py-2 rounded hover:bg-green-700">SUPPLIER LIST</Link>
      <Link to="/Order-stock" className="text-white font-semibold text-lg px-4 py-2 rounded hover:bg-green-700">ORDER LOW STOCKS</Link>
      <Link to="/inventory" className="text-white font-semibold text-lg px-4 py-2 rounded hover:bg-green-700">INVENTORY</Link>

      {/* ✅ Log Out Button */}
      <button onClick={handleLogout} className="bg-red-600 text-white font-semibold text-lg px-4 py-2 rounded hover:bg-red-800">LOG OUT</button>
    </nav>
  );
}
