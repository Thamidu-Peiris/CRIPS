import React from 'react';
import Sidebar from './Sidebar';

export default function CustomerOrders() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-72 p-8">
        <header className="p-6 bg-gradient-to-r from-cyan-600/90 to-blue-700/90 rounded-2xl shadow-xl backdrop-blur-md border border-cyan-500/20">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Customer Orders
          </h1>
          <p className="text-lg mt-2 font-light text-cyan-100/80">
            View and manage customer orders
          </p>
        </header>

        <div className="mt-8 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-6">Order List</h2>
          <p className="text-gray-400">
            This section is under development. Customer order details will be displayed here once the order model is implemented.
          </p>
        </div>
      </div>
    </div>
  );
}