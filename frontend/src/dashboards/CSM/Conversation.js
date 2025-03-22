//CRIPS\frontend\src\dashboards\CSM\Conversation.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";  // ✅ Import Navbar
import CSMSidebar from "../../components/CSMSidebar";  // ✅ Import Sidebar

const Conversation = () => {
  const { id } = useParams(); // ✅ Get Ticket ID from URL
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        console.log(`Fetching ticket ID: ${id}`);
        const response = await axios.get(`http://localhost:5000/api/support/${id}`);
        console.log("API Response:", response.data);
        setTicket(response.data);
        setSelectedStatus(response.data.status); // Set initial status
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
      // Send the reply
      const replyResponse = await axios.put(`http://localhost:5000/api/support/${id}/reply`, {
        message: replyMessage,
        sender: "CSM",
      });

      // Automatically change status to "Responded" if it was "Pending"
      let updatedStatus = ticket.status;
      if (ticket.status === "Pending") {
        updatedStatus = "Responded";
        await axios.put(`http://localhost:5000/api/support/${id}/status`, {
          status: updatedStatus,
        });
      }

      // Update the ticket state
      setTicket((prevTicket) => ({
        ...prevTicket,
        responses: replyResponse.data.responses,
        status: updatedStatus,
      }));

      setReplyMessage("");
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  };

  const handleStatusChange = async () => {
    if (!selectedStatus) return alert("Please select a status.");

    try {
      const response = await axios.put(`http://localhost:5000/api/support/${id}/status`, {
        status: selectedStatus,
      });

      setTicket((prevTicket) => ({
        ...prevTicket,
        status: response.data.status,
      }));

      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading ticket details...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar - Positioned on the left */}
      <CSMSidebar />

      <div className="flex-1 p-6">
        {/* ✅ Navbar - Positioned at the top */}
        <CSMNavbar />

        {/* ✅ Conversation Content */}
        <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-blue-700 text-center">Conversation</h2>

          <div className="mt-4">
            <p><strong>Subject:</strong> {ticket.subject}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  ticket.status === "Resolved"
                    ? "text-green-600"
                    : ticket.status === "Responded"
                    ? "text-blue-600"
                    : "text-red-600"
                }
              >
                {ticket.status}
              </span>
            </p>
          </div>

          {/* Small Status Change Box */}
          <div className="mt-4 flex items-center space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 border rounded-lg text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Responded">Responded</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button
              onClick={handleStatusChange}
              className="bg-blue-600 text-white p-2 rounded-lg text-sm"
            >
              Update
            </button>
          </div>

          {/* Ticket Responses */}
          <div className="mt-6 border p-3 rounded-lg bg-gray-100">
            <h4 className="font-semibold text-gray-700">Conversation</h4>

            {/* Display Customer's Initial Message */}
            <p className="mt-2 p-2 rounded-lg bg-green-100">
              <strong>Customer:</strong> {ticket.message}
            </p>

            {/* Display Responses */}
            {ticket.responses && ticket.responses.length > 0 ? (
              ticket.responses.map((res, index) => (
                <p
                  key={index}
                  className={`mt-2 p-2 rounded-lg ${
                    res.sender === "Customer" ? "bg-green-100" : "bg-blue-200"
                  }`}
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
              className="w-full bg-blue-600 text-white p-2 mt-2 rounded-lg"
            >
              Send Reply
            </button>
          </div>

          <button
            onClick={() => navigate("/dashboard/support-tickets")}
            className="w-full mt-4 bg-gray-400 text-white p-2 rounded-lg"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;