// frontend\src\components\InventoryM\Navbar.js
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = 'http://localhost:3000/';
  };

  const navItems = [
    { to: '/inventrymanagerdashboard', label: '📊Stock Reports' },
    { to: '/in-stock', label: '🌿In Stock' },
    { to: '/add-stock', label: '📋Add Stock' },
    { to: '/suppliers', label: '👨‍🌾Supplier List' },
    { to: '/Order-stock', label: '📦Order Stock' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-48 bg-green-900 text-white shadow-xl">
      <div className="flex flex-col h-full">
        {/* Header/Logo Section */}
        <div className="p-4 border-b border-green-800">
          <h2 className="text-xl font-bold text-white">Inventory Manager</h2>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center px-4 py-2 text-base font-medium hover:bg-green-800 transition-colors duration-200"
            >
              <span>{item.label.toUpperCase()}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-green-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white font-medium text-base px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}