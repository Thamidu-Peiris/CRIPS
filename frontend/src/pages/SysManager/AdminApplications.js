// CRIPS\frontend\src\pages\AdminApplications.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader";
import Sidebar from "../../dashboards/SM/sideBar"; // Import the same Sidebar as the dashboard
import { FaSearch, FaArrowLeft, FaDownload, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa"; // Icons for visual appeal

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]); // For search/filter
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [managerName, setManagerName] = useState(""); // State for manager's name
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch manager's name and check if the user is a System Manager
  useEffect(() => {
    let userInfo;
    try {
      userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.name) {
        setManagerName(user.name);
      } else {
        setManagerName("System Manager");
      }
    } catch (err) {
      console.error("Error parsing userInfo from localStorage:", err);
      navigate("/login");
      return;
    }
    console.log("UserInfo in AdminApplications:", userInfo);
    if (!userInfo || userInfo.role !== "SystemManager") {
      console.log("Redirecting to login: userInfo or role mismatch");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = localStorage.getItem("token");
        console.log("UserInfo:", userInfo);
        console.log("Token:", token);
        if (!userInfo || !token) {
          console.log("No userInfo or token found, redirecting to login");
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/jobs/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Applications response:", response.data.data);
        const updatedApplications = (response.data.data || []).map(app => ({
          ...app,
          status: app.status || "pending",
        }));
        setApplications(updatedApplications);
        setFilteredApplications(updatedApplications); // Initialize filtered applications
      } catch (error) {
        console.error("Error fetching applications:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch applications. Please try again.");
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Redirecting to login: Unauthorized or Forbidden");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [navigate]);

  // Handle search/filter
  useEffect(() => {
    const filtered = applications.filter(app =>
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchQuery, applications]);

  const handleAction = async (id, status) => {
    const confirmMessage = status === "approved"
      ? "Are you sure you want to approve this application?"
      : "Are you sure you want to reject this application?";
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage("");
      setError("");
      const token = localStorage.getItem("token");
      const payload = { status: status.toLowerCase() };
      if (status === "rejected") {
        if (!rejectionReason) {
          alert("Please provide a reason for rejection.");
          return;
        }
        payload.reason = rejectionReason;
      }
      console.log("Sending status update request:", { id, payload });
      const response = await axios.put(`http://localhost:5000/api/jobs/applications/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSuccessMessage(`Application ${status} successfully!`);
        setApplications(applications.map(app => app._id === id ? { ...app, status: payload.status, rejectionReason: status === "rejected" ? rejectionReason : null } : app));
        setRejectionReason("");
        setSelectedApplicationId(null);
      }
    } catch (error) {
      console.error(`Error ${status} application:`, error);
      setError(error.response?.data?.message || `Failed to ${status} application. Please try again.`);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> {/* Add the same sidebar as the dashboard */}
      <div className="ml-64 flex-1 p-6">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">System Manager Dashboard - Job Applications</h1>
              <p className="text-lg mt-2">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate("/sm-dashboard")} // Navigate back to dashboard
              className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or job title..."
              className="w-full p-3 pl-10 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Applications List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <p className="text-center text-gray-600">No applications to review.</p>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-blue-600">{app.jobTitle}</h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      app.status.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    } flex items-center`}
                  >
                    {app.status.toLowerCase() === "approved" && <FaCheckCircle className="mr-1" />}
                    {app.status.toLowerCase() === "pending" && <FaHourglassHalf className="mr-1" />}
                    {app.status.toLowerCase() === "rejected" && <FaTimesCircle className="mr-1" />}
                    {app.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Name:</strong> {app.firstName} {app.lastName}</p>
                    <p><strong>Username:</strong> {app.username}</p>
                    <p><strong>Email:</strong> {app.email}</p>
                    <p><strong>Phone Number:</strong> {app.phoneNumber}</p>
                  </div>
                  <div>
                    <p><strong>Address:</strong> {app.address}</p>
                    <p><strong>Start Date:</strong> {app.startDate && !isNaN(new Date(app.startDate)) ? new Date(app.startDate).toLocaleDateString() : "Not provided"}</p>
                    <p>
                      <strong>Cover Letter:</strong>{" "}
                      {app.coverLetter ? (
                        <a href={`http://localhost:5000/${app.coverLetter}`} className="text-blue-600 hover:underline flex items-center">
                          <FaDownload className="mr-1" /> Download
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                    <p>
                      <strong>Resume:</strong>{" "}
                      <a href={`http://localhost:5000/${app.resume}`} className="text-blue-600 hover:underline flex items-center">
                        <FaDownload className="mr-1" /> Download
                      </a>
                    </p>
                  </div>
                </div>
                {app.status.toLowerCase() === "rejected" && app.rejectionReason && (
                  <p className="mt-4 text-red-600"><strong>Rejection Reason:</strong> {app.rejectionReason}</p>
                )}
                {console.log("Application status for", app._id, ":", app.status)}
                {app.status.toLowerCase() === "pending" ? (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleAction(app._id, "approved")}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium flex items-center"
                      disabled={loading}
                    >
                      <FaCheckCircle className="mr-2" /> {loading ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => setSelectedApplicationId(app._id)}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium flex items-center"
                      disabled={loading}
                    >
                      <FaTimesCircle className="mr-2" /> {loading ? "Processing..." : "Reject"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-500">Action not available for status: {app.status}</p>
                )}
                {selectedApplicationId === app._id && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Reason for Rejection *</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                      disabled={loading}
                    />
                    <div className="mt-2 flex space-x-4">
                      <button
                        onClick={() => handleAction(app._id, "rejected")}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Submit Rejection"}
                      </button>
                      <button
                        onClick={() => setSelectedApplicationId(null)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 font-medium"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;