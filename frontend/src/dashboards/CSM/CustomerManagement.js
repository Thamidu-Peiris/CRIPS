////CRIPS\frontend\src\dashboards\CSM\CustomerManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchPendingCustomers();
  }, []);

  const fetchPendingCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/csm/customers/pending');
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/csm/customers/${id}/approve`);
      fetchPendingCustomers(); // Refresh list after approval
    } catch (err) {
      console.error('Approval failed', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/csm/customers/${id}/decline`);
      fetchPendingCustomers(); // Refresh list after rejection
    } catch (err) {
      console.error('Rejection failed', err);
    }
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Approval Management</h2>
      {customers.length === 0 ? (
        <p className="text-gray-600">No pending customers.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Company</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-t">
                <td className="p-2">{customer.firstName} {customer.lastName}</td>
                <td className="p-2">{customer.email}</td>
                <td className="p-2">{customer.companyName || '-'}</td>
                <td className="p-2">{customer.status}</td>
                <td className="p-2">
                  <button 
                    className="bg-green-500 text-white px-4 py-2 mr-2 rounded hover:bg-green-600"
                    onClick={() => handleApprove(customer._id)}
                  >
                    Approve
                  </button>
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleReject(customer._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerManagement;