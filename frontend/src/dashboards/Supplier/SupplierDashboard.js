import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplierDashboard = ({ supplierId }) => {
  const [orders, setOrders] = useState([]);



  useEffect(() => {
    if (supplierId) {
      fetchOrders();
    }
  }, [supplierId]);
  

  const fetchOrders = async () => {
    const res = await axios.get(`/api/supplier-dashboard/orders/${supplierId}`);
    setOrders(res.data);
  };

  const handleApprove = async (orderId) => {
    await axios.put(`/api/supplier-dashboard/orders/${orderId}/approve`);
    fetchOrders();
  };

  const handleShip = async (orderId) => {
    await axios.put(`/api/supplier-dashboard/orders/${orderId}/ship`);
    fetchOrders();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Supplier Dashboard</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded shadow-md">
            <p><strong>Item:</strong> {order.itemType}</p>
            <p><strong>Quantity:</strong> {order.quantity} {order.unit}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>

            {order.status === 'pending' && (
              <button className="bg-green-500 text-white p-2 rounded mt-2"
                onClick={() => handleApprove(order._id)}>Approve</button>
            )}

            {order.status === 'confirmed' && (
              <button className="bg-blue-500 text-white p-2 rounded mt-2"
                onClick={() => handleShip(order._id)}>Mark as Shipped</button>
            )}

            {order.status === 'shipped' && (
              <p className="text-green-700 mt-2">✅ Shipped on {new Date(order.shippedDate).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierDashboard;
