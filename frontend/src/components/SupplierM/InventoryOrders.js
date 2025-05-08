import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const InventoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  
  // Extract supplierId from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const supplierId = queryParams.get('supplierId') || 'default-supplier-id'; // Fallback if not provided

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/suppliers/orders/${supplierId}`);
        setOrders(response.data.map(order => ({
          ...order,
          isAccepted: order.status !== 'pending' // Track if the order has been accepted
        })));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [supplierId]);

  const handleAccept = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/suppliers/orders/${orderId}/approve`);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...response.data.updatedOrder, isAccepted: true } : order
      ));
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleAddSupply = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/suppliers/orders/${orderId}/ship`);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...response.data.updatedOrder } : order
      ));
    } catch (error) {
      console.error('Error adding supply:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-green-800 mb-8">Inventory Orders</h1>
        <div className="bg-white shadow-lg p-8 rounded-lg border border-green-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-4 text-left text-sm font-semibold">Order ID</th>
                  <th className="p-4 text-left text-sm font-semibold">Item Type</th>
                  <th className="p-4 text-left text-sm font-semibold">Quantity</th>
                  <th className="p-4 text-left text-sm font-semibold">Unit</th>
                  <th className="p-4 text-left text-sm font-semibold">Delivery Date</th>
                  <th className="p-4 text-left text-sm font-semibold">Supplier Name</th>
                  <th className="p-4 text-left text-sm font-semibold">Inventory Manager</th>
                  <th className="p-4 text-left text-sm font-semibold">Status</th>
                  <th className="p-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                    <td className="p-4 text-green-900">{order._id}</td>
                    <td className="p-4 text-green-900">{order.itemType || 'N/A'}</td>
                    <td className="p-4 text-green-900">{order.quantity || 'N/A'}</td>
                    <td className="p-4 text-green-900">{order.unit || 'N/A'}</td>
                    <td className="p-4 text-green-900">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 text-green-900">{order.supplierId?.name || 'N/A'}</td>
                    <td className="p-4 text-green-900">{order.inventoryManagerId?.firstName || 'N/A'} {order.inventoryManagerId?.lastName || ''}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                        order.status === 'delivered' ? 'bg-teal-100 text-teal-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {!order.isAccepted && order.status === 'pending' && (
                        <button
                          onClick={() => handleAccept(order._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                        >
                          Accept
                        </button>
                      )}
                      {order.isAccepted && order.status === 'confirmed' && (
                        <button
                          onClick={() => handleAddSupply(order._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Add Supply
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOrders;