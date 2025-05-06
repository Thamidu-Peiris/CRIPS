// frontend\src\dashboards\CSM\CustomerRequests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingCustomers();
  }, []);

  const fetchPendingCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/csm/customers/pending");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
      setError("Failed to fetch customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this customer?")) return;
    try {
      await axios.put(`http://localhost:5000/api/csm/customers/${id}/approve`);
      fetchPendingCustomers();
    } catch (err) {
      console.error("Approval failed", err);
      setError("Failed to approve customer. Please try again.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this customer?")) return;
    try {
      await axios.put(`http://localhost:5000/api/csm/customers/${id}/decline`);
      fetchPendingCustomers();
    } catch (err) {
      console.error("Rejection failed", err);
      setError("Failed to reject customer. Please try again.");
    }
  };

  // Function to determine button styles for status, with Pending as default
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-800 hover:bg-green-300";
      case "Declined":
        return "bg-red-200 text-red-800 hover:bg-red-300";
      case "Pending":
      default:
        return "bg-yellow-200 text-yellow-800 hover:bg-yellow-300";
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <CSMSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
        <CSMNavbar />

        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Customer Approval Management
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
              {error}
            </div>
          )}

          {/* Customers Table */}
          {!loading && !error && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    <th className="py-4 px-6 text-left text-sm font-semibold">Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold">Company</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                        No pending customers.
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-700">
                          {customer.firstName} {customer.lastName}
                        </td>
                        <td className="py-4 px-6 text-gray-700">{customer.email}</td>
                        <td className="py-4 px-6 text-gray-700">
                          {customer.companyName || "-"}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusButtonStyle(
                              customer.status
                            )}`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex gap-2">
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                            onClick={() => handleApprove(customer._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            onClick={() => handleReject(customer._id)}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerManagement;