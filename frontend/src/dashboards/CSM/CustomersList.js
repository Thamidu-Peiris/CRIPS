// frontend\src\dashboards\CSM\CustomersList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";
import { FiDownload } from "react-icons/fi"; // Import the download icon

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedCustomers();
  }, []);

  const fetchApprovedCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/csm/customers/approved");
      setCustomers(res.data);
      setFilteredCustomers(res.data); // Initialize filtered customers
    } catch (err) {
      console.error("Failed to fetch approved customers", err);
      setError("Failed to fetch approved customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter customers based on the search query
    const filtered = customers.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const email = customer.email.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });

    setFilteredCustomers(filtered);
  };

  // Function to convert customers data to CSV and trigger download
  const downloadCSV = () => {
    if (customers.length === 0) {
      alert("No approved customers to download.");
      return;
    }

    // Define the CSV headers
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Company Name",
      "Address",
      "Phone Number",
      "Status",
      "Role",
      "Business Address",
      "Tax ID",
    ];

    // Map customers data to CSV rows
    const rows = customers.map((customer) => [
      customer.firstName || "",
      customer.lastName || "",
      customer.email || "",
      customer.companyName || "",
      customer.address || "",
      customer.phoneNumber || "",
      customer.status || "",
      customer.role || "",
      customer.businessAddress || "",
      customer.taxId || "",
    ]);

    // Combine headers and rows into CSV content
    const csvContent = [
      headers.join(","), // Header row
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")), // Data rows
    ].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "approved_customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to determine button styles for status
  const getStatusButtonStyle = (status) => {
    const statusLower = status ? status.toLowerCase() : "pending";
    switch (statusLower) {
      case "approved":
        return "bg-green-200 text-green-800 hover:bg-green-300";
      case "declined":
        return "bg-red-200 text-red-800 hover:bg-red-300";
      case "pending":
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
            Approved Customers List
          </h2>

          {/* Search Input and Download Button */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex justify-center w-full">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={downloadCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <FiDownload className="text-lg" /> {/* Add the download icon */}
              <span>CSV</span>
            </button>
          </div>

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
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                        {searchQuery
                          ? "No customers match your search."
                          : "No approved customers."}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
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
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            onClick={() => navigate(`/customer/${customer._id}`)}
                          >
                            View
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

export default CustomersList;