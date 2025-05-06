import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        params: { userId },
      });
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order. Please check the Order ID.");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Company Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("CRIPS Plant Export", margin, y);
    y += 6;
    doc.text("123 Business Rd, Colombo, WP, 10002", margin, y);
    y += 6;
    doc.text("Email: support@cripsplants.com", margin, y);
    y += 10;

    // Order Info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Order #${order._id}`, margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
    y += 6;
    doc.text(`Status: ${order.status}`, margin, y);
    y += 10;

    // Customer Info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.userId.firstName} ${order.userId.lastName}`, margin, y);
    y += 6;
    doc.text(order.userId.email, margin, y);
    y += 6;
    doc.text(
      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}, ${order.shippingInfo.country}`,
      margin,
      y,
      { maxWidth: pageWidth - 2 * margin }
    );
    y += 12;

    // Items Table
    autoTable(doc, {
      startY: y,
      head: [["Item", "Quantity", "Unit Price", "Total"]],
      body: order.items.map((item) => [
        item.plantName,
        item.quantity,
        `$${item.itemPrice.toFixed(2)}`,
        `$${(item.quantity * item.itemPrice).toFixed(2)}`,
      ]),
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 10;

    // Totals
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    if (order.couponCode) {
      doc.text(`Subtotal: $${order.items.reduce((sum, item) => sum + item.quantity * item.itemPrice, 0).toFixed(2)}`, pageWidth - margin - 50, y);
      y += 6;
      doc.text(`Coupon (${order.couponCode}): -$${order.couponDiscount.toFixed(2)}`, pageWidth - margin - 50, y);
      y += 6;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${order.total.toFixed(2)}`, pageWidth - margin - 50, y);
    y += 10;

    // Tracking Info
    if (order.trackingNumber || order.trackingLocation) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Tracking Information:", margin, y);
      y += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      if (order.trackingNumber) {
        doc.text(`Tracking Number: ${order.trackingNumber}`, margin, y);
        y += 6;
      }
      if (order.trackingLocation) {
        doc.text(`Current Location: ${order.trackingLocation}`, margin, y);
      }
    }

    // Footer
    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", pageWidth / 2, y, { align: "center" });

    // Save PDF
    doc.save(`Invoice_${order._id}.pdf`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <CSMSidebar />

      <div className="flex-1 p-6 overflow-auto">
        {/* Navbar */}
        <CSMNavbar />

        {/* Track Order Content */}
        <div className="max-w-5xl mx-auto py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Track Order</h2>

          {/* Rounded Rectangle Search Form */}
          <form onSubmit={handleSearch} className="mb-10 flex justify-center">
            <div className="relative w-full max-w-lg flex items-center">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className="w-full py-3 px-5 pr-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-8 text-center">
              <p className="text-red-600 bg-red-100 py-2 px-4 rounded-lg inline-block">{error}</p>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Order Details</h3>
                <button
                  onClick={generateInvoicePDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Generate Invoice PDF
                </button>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Order Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                    <p><span className="font-semibold">Status:</span> <span className={`inline-block px-2 py-1 rounded text-sm ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span></p>
                    <p><span className="font-semibold">Total:</span> ${order.total.toFixed(2)}</p>
                    <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
                    {order.couponCode && (
                      <p><span className="font-semibold">Coupon:</span> {order.couponCode} (-${order.couponDiscount.toFixed(2)})</p>
                    )}
                    {order.trackingNumber && (
                      <p><span className="font-semibold">Tracking Number:</span> {order.trackingNumber}</p>
                    )}
                    {order.trackingLocation && (
                      <p><span className="font-semibold">Current Location:</span> {order.trackingLocation}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-semibold">Name:</span> {order.userId.firstName} {order.userId.lastName}</p>
                    <p><span className="font-semibold">Email:</span> {order.userId.email}</p>
                    <p><span className="font-semibold">Shipping Address:</span> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.zipCode}, {order.shippingInfo.country}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">Items</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-semibold text-gray-800">{item.plantName}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-gray-800 font-medium">${(item.itemPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">Status History</h4>
                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-semibold text-gray-700">Status:</span> {history.status}</p>
                      <p><span className="font-semibold text-gray-700">Updated:</span> {new Date(history.updatedAt).toLocaleString()}</p>
                      <p><span className="font-semibold text-gray-700">By:</span> {history.updatedBy.toString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;