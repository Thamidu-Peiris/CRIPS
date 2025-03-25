import { Link } from 'react-router-dom';
import './styles.css'; // ✅ CSS file link

export default function Navbar() {
  return (
    <nav className="plant-navbar">
      <Link to="/inventorymanagerdashboard" className="plant-nav-link">STOCK REPORTS</Link>
      <Link to="/in-stock" className="plant-nav-link">IN STOCK</Link>
      <Link to="/add-stock" className="plant-nav-link">ADD STOCK</Link>
      <Link to="/suppliers" className="plant-nav-link">SUPPLIER LIST</Link>
    </nav>
  );
}
