// frontend\src\dashboards\CSM\Conversation.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";
import { FaPaperPlane, FaArrowLeft, FaTag, FaCommentDots } from "react-icons/fa";

const Conversation = () => {
  const { id } = useParams();
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
        setSelectedStatus(response.data.status);
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
      const replyResponse = await axios.put(`http://localhost:5000/api/support/${id}/reply`, {
        message: replyMessage,
        sender: "CSM",
      });

      let updatedStatus = ticket.status;
      if (ticket.status === "Pending") {
        updatedStatus = "Responded";
        await axios.put(`http://localhost:5000/api/support/${id}/status`, {
          status: updatedStatus,
        });
      }

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

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <CSMSidebar />
        <div className="flex-1 p-6">
          <CSMNavbar />
          <div className="text-center text-gray-500 text-lg mt-16">
            <p>Loading ticket details...</p>
            <div className="mt-4 flex justify-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <CSMSidebar />
        <div className="flex-1 p-6">
          <CSMNavbar />
          <div className="max-w-4xl mx-auto mt-16 p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
      <CSMSidebar />
      <div className="flex-1 p-4 lg:p-8">
        <CSMNavbar />
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight text-center">
            
          </h2>

          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            {/* Ticket Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{ticket.subject}</h3>
                <p className="mt-1 text-gray-500">
                  <span className="font-medium">Status: </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      ticket.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "Responded"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Responded">Responded</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  onClick={handleStatusChange}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all duration-200"
                >
                  <FaTag className="mr-2" />
                  Update
                </button>
              </div>
            </div>

            {/* Conversation Section */}
            <div className="mt-6 bg-gray-50 p-6 rounded-xl shadow-inner">
              <h4 className="font-semibold text-gray-800 text-lg flex items-center mb-4">
                <FaCommentDots className="mr-2 text-blue-500" />
                Conversation History
              </h4>

              {/* Customer's Initial Message */}
              <div className="mb-4 p-4 rounded-lg bg-green-50 shadow-sm transition-all duration-200 hover:shadow-md">
                <p className="text-gray-700">
                  <span className="font-semibold text-green-700">Customer:</span> {ticket.message}
                </p>
              </div>

              {/* Responses */}
              {ticket.responses && ticket.responses.length > 0 ? (
                ticket.responses.map((res, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                      res.sender === "Customer" ? "bg-green-50" : "bg-blue-50"
                    }`}
                  >
                    <p className="text-gray-700">
                      <span
                        className={`font-semibold ${
                          res.sender === "Customer" ? "text-green-700" : "text-blue-700"
                        }`}
                      >
                        {res.sender}:
                      </span>{" "}
                      {res.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No responses yet.</p>
              )}
            </div>

            {/* Reply Form */}
            <div className="mt-6">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your response..."
                className="w-full p-4 border border-gray-200 rounded-lg h-32 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none shadow-sm transition-all duration-200"
              ></textarea>
              <button
                onClick={handleReplySubmit}
                className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
              >
                <FaPaperPlane className="mr-2" />
                Send Reply
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/csm/support-tickets")}
              className="w-full mt-6 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;