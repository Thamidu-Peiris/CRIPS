import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '15px', background: '#333', color: '#fff' }}>
      <Link to="/inventorymanagerdashboard" style={{ color: '#fff', margin: '10px' }}>STOCK REPORTS</Link>
      <Link to="/in-stock" style={{ color: '#fff', margin: '10px' }}>IN STOCK</Link>
      <Link to="/add-stock" style={{ color: '#fff', margin: '10px' }}>ADD STOCK</Link>
      <Link to="/suppliers" style={{ color: '#fff', margin: '10px' }}>SUPPLIER LIST</Link>
      <Link to="/supplier-form" style={{ color: '#fff', margin: '10px' }}>SUPPLIER FORM</Link>
    </nav>
  );
}
