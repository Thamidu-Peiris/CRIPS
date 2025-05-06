import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const InventoryOrders = () => {
  const { supplierId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supplier/orders/${supplierId || 'default-supplier-id'}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [supplierId]);

  const handleApprove = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/supplier/orders/${orderId}/approve`);
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.updatedOrder : order
      ));
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Inventory Orders</h1>
        <div className="bg-white shadow p-6 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Plant Name</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b">
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order.plantName || 'N/A'}</td>
                  <td className="p-3">{order.quantity || 'N/A'}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(order._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
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
  );
};

export default InventoryOrders;