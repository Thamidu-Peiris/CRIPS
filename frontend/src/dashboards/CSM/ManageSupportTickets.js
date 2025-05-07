// frontend\src\dashboards\CSM\ManageSupportTickets.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

const ManageSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch Tickets from API
  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/support");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to fetch tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle ticket status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100"; // Yellow for Pending
      case "Responded":
        return "text-blue-600 bg-blue-100"; // Blue for Responded
      case "Resolved":
        return "text-green-600 bg-green-100"; // Green for Resolved
      default:
        return "text-gray-600 bg-gray-100"; // Gray for unknown status
    }
  };

  // Add delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/support/${id}`);
      setTickets(tickets.filter((ticket) => ticket._id !== id)); // Remove from state
      alert("Ticket deleted successfully!");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Failed to delete ticket. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <CSMSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
        <CSMNavbar />

        {/* Support Tickets Section */}
        <div className="p-0 overflow-auto mt-120">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
            
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Tickets Table */}
          {!loading && !error && (
            <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#1CB04B]">
                  <th className="py-4 px-6 text-left text-white">ID</th>
                  <th className="py-4 px-6 text-left text-white">Customer</th>
                  <th className="py-4 px-6 text-left text-white">Subject</th>
                  <th className="py-4 px-6 text-left text-white">Status</th>
                  <th className="py-4 px-6 text-left text-white">Created</th>
                  <th className="py-4 px-6 text-left text-white">Updated</th>
                  <th className="py-4 px-6 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 border-b">#{index + 1}</td>
                    <td className="py-4 px-6 border-b">{ticket.name}</td>
                    <td className="py-4 px-6 border-b">{ticket.subject}</td>
                    <td className="py-4 px-6 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="py-4 px-6 border-b">
                      {formatDate(ticket.updatedAt)}
                    </td>
                    <td className="py-4 px-6 border-b flex gap-2">
                      {/* View Button */}
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        onClick={() =>
                          navigate(`/dashboard/conversation/${ticket._id}`)
                        }
                      >
                        View
                      </button>

                      {/* Delete Button */}
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        onClick={() => handleDelete(ticket._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageSupportTickets;