
// frontend\src\dashboards\Customer\ViewTicket.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import CustomerHeader from "../../components/CustomerHeader";

const ViewTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        console.log(`Fetching ticket ID: ${id}`);
        const response = await axios.get(`http://localhost:5000/api/support/${id}`);
        console.log("API Response:", response.data);
        setTicket(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket:", error.response ? error.response.data : error.message);
        setError("Failed to load ticket.");
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) {
      setErrorMessage("Reply cannot be empty.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/support/${id}/reply`, {
        message: replyMessage,
        sender: "Customer",
      });

      setTicket((prevTicket) => ({
        ...prevTicket,
        responses: response.data.responses,
      }));

      setReplyMessage("");
      setSuccessMessage("Reply sent successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending reply:", error);
      setErrorMessage(error.response?.data?.message || "Failed to send reply. Please try again.");
      setSuccessMessage("");
    }
  };

  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-gray-600 mt-10"
    >
      Loading ticket details...
    </motion.div>
  );
  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-red-600 mt-10"
    >
      {error}
    </motion.div>
  );

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-lg sticky top-0 z-50">
        <motion.div
          className="text-lg font-bold flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="h-10 mr-2"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium hover:text-green-700 transition">Home</Link>
          <Link to="/shop" className="text-gray-600 hover:text-gray-800 transition">Shop</Link>
          <Link to="/dashboard/support" className="text-gray-600 hover:text-gray-800 transition">Support</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-800 transition">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-800 transition">Contact Us</Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Ticket Content */}
      <motion.div
        className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">Ticket Details</h2>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Ticket Info */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-lg">
              <strong>Subject:</strong> {ticket.subject}
            </p>
            <p className="text-lg">
              <strong>Status:</strong>{" "}
              <span className={ticket.status === "Resolved" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {ticket.status}
              </span>
            </p>
          </div>
        </div>

        {/* Ticket Responses */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Conversation</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-100 rounded-lg">
            {ticket.responses && ticket.responses.length > 0 ? (
              ticket.responses.map((res, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: res.sender === "Customer" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    res.sender === "Customer"
                      ? "bg-blue-200 ml-auto text-right"
                      : "bg-gray-200 mr-auto text-left"
                  }`}
                >
                  <p className="text-sm text-gray-500">{res.sender}</p>
                  <p className="mt-1">{res.message}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No responses yet.</p>
            )}
          </div>
        </div>

        {/* Reply Form */}
        <div className="mt-8">
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Write your response..."
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-28"
          ></textarea>
          <motion.button
            onClick={handleReplySubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-green-600 text-white p-3 mt-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Send Reply
          </motion.button>
        </div>

        <motion.button
          onClick={() => navigate("/dashboard/support")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500 transition font-semibold"
        >
          Back to Tickets
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ViewTicket;