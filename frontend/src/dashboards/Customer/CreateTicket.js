
//CRIPS\frontend\src\dashboards\Customer\CreateTicket.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader"; // Adjust the import path based on your structure

const CreateTicket = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const [formData, setFormData] = useState({
    name: userInfo.username || "",
    email: userInfo.email || "",
    subject: "",
    message: "",
    orderId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/support", formData);
      alert("Support ticket submitted successfully!");
      navigate("/dashboard/support"); // ✅ Redirect to CustomerSupport after submission
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit support ticket. Please try again.");
    }
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 text-center text-2xl font-bold">
        Submit a Support Ticket
      </header>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>

        {/* 🔹 Customer Header */}
        <CustomerHeader />
      </nav>

      {/* 🔹 Breadcrumb Navigation (Optional) */}
      <div className="text-gray-500 mb-4 p-6">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to="/dashboard/support" className="hover:underline">Support</Link> / Create Ticket
      </div>

      {/* Create Ticket Content */}
      <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-green-700 text-center">Submit a Support Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* ✅ Name Field (Read-Only) */}
          <div>
            <label className="block text-gray-600 font-medium">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* ✅ Email Field (Read-Only) */}
          <div>
            <label className="block text-gray-600 font-medium">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* ✅ Subject Field */}
          <div>
            <label className="block text-gray-600 font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* ✅ Message Field */}
          <div>
            <label className="block text-gray-600 font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg h-24"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard/support")} // ✅ Cancel button goes back
              className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;