import React from 'react';
import Sidebar from './Sidebar';

const SupplierDashboard = () => {
  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Welcome, Supplier 🌱</h1>

        {/* Inventory Orders Section */}
        <section id="orders" className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">📦 Inventory Orders</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p>Here you can view and manage plant supply orders from the inventory team.</p>
          </div>
        </section>

        {/* Shipments Section */}
        <section id="shipments" className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">🚚 Shipments</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p>Track shipment approvals, packing status, and delivery schedules.</p>
          </div>
        </section>

        {/* Profile Section */}
        <section id="profile">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">👤 Supplier Profile</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p>Manage your company info, contact details, and bank details for payment.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupplierDashboard;