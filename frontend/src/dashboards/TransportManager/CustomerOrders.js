import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "TransportManager") {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
        setFilteredOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status.toLowerCase() === status.toLowerCase())
      );
    }
  };

  // Function to determine status colors
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Customer Orders Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Prepare table data
    const tableColumn = [
      "Order ID",
      "Customer",
      "Status",
      "Tracking Number",
      "Current Location",
    ];
    const tableRows = [];

    filteredOrders.forEach((order) => {
      const orderData = [
        order._id,
        `${order.userId?.firstName || ""} ${order.userId?.lastName || ""}`,
        order.status,
        order.trackingNumber || "N/A",
        order.trackingLocation || "N/A",
      ];
      tableRows.push(orderData);
    });

    // Generate table using jspdf-autotable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [0, 105, 92], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save("customer_orders_report.pdf");
  };

  if (loading) {
    return <div className="text-center p-6 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 text-gray-800 font-sans flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <header className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-teal-900 tracking-tight">
                Customer Orders
              </h1>
              <p className="text-lg mt-2 font-light text-gray-500">
                View customer orders and their statuses
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
              <button
                onClick={generatePDF}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-200"
              >
                Download PDF
              </button>
            </div>
          </div>
        </header>

        {/* Orders Table Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-teal-900 mb-6">
            Order Overview
          </h2>
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No orders available for the selected status.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-6 text-teal-900 font-semibold uppercase text-sm tracking-wide">
                      Order ID
                    </th>
                    <th className="py-4 px-6 text-teal-900 font-semibold uppercase text-sm tracking-wide">
                      Customer
                    </th>
                    <th className="py-4 px-6 text-teal-900 font-semibold uppercase text-sm tracking-wide">
                      Status
                    </th>
                    <th className="py-4 px-6 text-teal-900 font-semibold uppercase text-sm tracking-wide">
                      Tracking Number
                    </th>
                    <th className="py-4 px-6 text-teal-900 font-semibold uppercase text-sm tracking-wide">
                      Current Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-teal-50 transition duration-200"
                    >
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {order._id}
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {order.trackingNumber || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {order.trackingLocation || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}