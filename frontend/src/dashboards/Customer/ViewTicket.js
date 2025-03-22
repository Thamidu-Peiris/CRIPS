
// CRIPS\frontend\src\dashboards\Customer\ViewTicket.js


import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Added Link import
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader"; // Ensure this path is correct

const ViewTicket = () => {
  const { id } = useParams(); // ✅ Get Ticket ID from URL
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const [error, setError] = useState(null); // ✅ Add error state
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        console.log(`Fetching ticket ID: ${id}`); // ✅ Debugging log
        const response = await axios.get(`http://localhost:5000/api/support/${id}`);
        console.log("API Response:", response.data); // ✅ Debugging log
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
    if (!replyMessage.trim()) return alert("Reply cannot be empty.");

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
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading ticket details...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>; // ✅ Display error message

  return (
    <div className="font-sans min-h-screen bg-gray-100">
      {/* 🔹 Navbar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/dashboard/support" className="text-gray-600">Support</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>
        {/* 🔹 Customer Header */}
        <CustomerHeader />
      </nav>

      {/* 🔹 Ticket Content */}
      <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-green-700 text-center">Ticket Details</h2>

        <div className="mt-4">
          <p>
            <strong>Subject:</strong> {ticket.subject}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={ticket.status === "Resolved" ? "text-green-600" : "text-red-600"}>{ticket.status}</span>
          </p>
        </div>

        {/* Ticket Responses */}
        <div className="mt-6 border p-3 rounded-lg bg-gray-100">
          <h4 className="font-semibold text-gray-700">Conversation</h4>
          {ticket.responses && ticket.responses.length > 0 ? (
            ticket.responses.map((res, index) => (
              <p
                key={index}
                className={`mt-2 p-2 rounded-lg ${res.sender === "Customer" ? "bg-green-100" : "bg-gray-200"}`}
              >
                <strong>{res.sender}:</strong> {res.message}
              </p>
            ))
          ) : (
            <p className="text-gray-600">No responses yet.</p>
          )}
        </div>

        {/* Reply Form */}
        <div className="mt-4">
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Write your response..."
            className="w-full p-2 border rounded-lg h-24"
          ></textarea>
          <button
            onClick={handleReplySubmit}
            className="w-full bg-green-600 text-white p-2 mt-2 rounded-lg"
          >
            Send Reply
          </button>
        </div>

        <button
          onClick={() => navigate("/dashboard/support")}
          className="w-full mt-4 bg-gray-400 text-white p-2 rounded-lg"
        >
          Back to Tickets
        </button>
      </div>
    </div>
  );
};

export default ViewTicket;