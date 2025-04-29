import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";
import { motion } from "framer-motion";

const CustomerSupport = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Fetch user-specific tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/support");
        setTickets(response.data.filter((ticket) => ticket.email === userInfo.email));
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, [userInfo.email]);

  // Fetch FAQs from the backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/faqs");
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 text-center text-2xl font-bold">
        Customer Support
      </header>

      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-12 transition-transform hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/dashboard/orders"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Orders
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Support Content */}
      <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold text-green-700 text-center">
          What can I help you with?
        </h2>

        {/* Search Box */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full max-w-lg p-3 border rounded-full shadow-sm text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700">Frequently Asked Questions</h3>
          <div className="mt-3 space-y-4">
            {faqs.length > 0 ? (
              faqs
                .filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((faq, index) => (
                  <details key={index} className="border p-3 rounded-lg cursor-pointer">
                    <summary className="font-medium text-gray-800">{faq.question}</summary>
                    <p className="text-gray-600 mt-2">{faq.answer}</p>
                  </details>
                ))
            ) : (
              <p className="text-gray-600">No FAQs available.</p>
            )}
          </div>
        </div>

        {/* Navigate to CreateTicket page */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/dashboard/create-ticket")}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700"
          >
            Create Support Ticket
          </button>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h3 className="text-2xl font-bold text-green-700 text-center">Your Support Tickets</h3>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="text-center border-b border-gray-300">
                  <td>{ticket.subject}</td>
                  <td
                    className={`py-3 px-4 font-bold ${
                      ticket.status === "Resolved" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {ticket.status}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/dashboard/view-ticket/${ticket._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      View Ticket
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-600">
                  No support tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerSupport;