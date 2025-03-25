import { Link, useNavigate } from 'react-router-dom';
import './styles.css'; // ✅ Keep your modern plant-themed CSS

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Redirects to the home/login page
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <nav className="plant-navbar">
      <Link to="/inventrymanagerdashboard" className="plant-nav-link">STOCK REPORTS</Link>
      <Link to="/in-stock" className="plant-nav-link">IN STOCK</Link>
      <Link to="/add-stock" className="plant-nav-link">ADD STOCK</Link>
      <Link to="/suppliers" className="plant-nav-link">SUPPLIER LIST</Link>
      <Link to="/order-low-stocks" className="plant-nav-link">ORDER LOW STOCKS</Link>
      {/* ✅ Newly added INVENTORY Option */}
      <Link to="/inventory" className="plant-nav-link">INVENTORY</Link>

      {/* ✅ Log Out Button */}
      <button className="plant-nav-link" onClick={handleLogout}>LOG OUT</button>
    </nav>
  );
}
