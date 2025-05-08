import React from 'react';
import { FaBoxes, FaShippingFast, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-10 text-center">🌿 Supplier Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/inventory-orders" className="flex items-center gap-2 hover:bg-green-700 px-4 py-2 rounded">
          <FaBoxes /> Inventory Orders
        </Link>
        <Link to="/shipments" className="flex items-center gap-2 hover:bg-green-700 px-4 py-2 rounded">
          <FaShippingFast /> Shipments
        </Link>
        <Link to="/supplier-profile" className="flex items-center gap-2 hover:bg-green-700 px-4 py-2 rounded">
          <FaUser /> Profile
        </Link>
        <Link to="/logout" className="flex items-center gap-2 mt-auto hover:bg-green-700 px-4 py-2 rounded">
          <FaSignOutAlt /> Logout
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
