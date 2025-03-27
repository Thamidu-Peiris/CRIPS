// CRIPS\frontend\src\pages\AdminApplications.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../dashboards/SM/sideBar";
import { FaSearch, FaArrowLeft, FaDownload, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [managerName, setManagerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

        // Sort applications by createdAt in descending order (newest first)
        updatedApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setApplications(updatedApplications);
        setFilteredApplications(updatedApplications);
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

  useEffect(() => {
    const filtered = applications.filter(app =>
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchQuery, applications]);


  

  const handleAction = async (app, status) => {
    console.log(app.email);
    const id = app._id; // ✅ FIX - define id from app
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
  
      console.log("Sending status update request:", { id, payload });  // ✅ id is now defined
      const response = await axios.put(`http://localhost:5000/api/jobs/applications/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success) {
        setSuccessMessage(`Application ${status} successfully!`);
  
        // ✅ Send Email Notification
        await axios.post("http://localhost:5000/api/email/send-status-notification", {
          to: app.email,
          name: app.firstName,
          role: app.jobTitle,
          status: status.toLowerCase(),
          rejectionReason: status === "rejected" ? rejectionReason : null
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const updatedApplications = applications.map(item =>
          item._id === id ? { ...item, status: payload.status, rejectionReason: status === "rejected" ? rejectionReason : null } : item
        );
        updatedApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setApplications(updatedApplications);
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">System Manager Dashboard - Job Applications</h1>
              <p className="text-xl mt-2 font-light">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate("/sm-dashboard")}
              className="flex items-center bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-2 rounded-xl transition duration-300"
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
              className="w-full p-3 pl-10 border border-gray-700 rounded-xl bg-gray-900/50 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-500/20 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/20 border-l-4 border-green-500 text-green-300 p-4 mb-6 rounded-xl">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Applications List */}
        {loading ? (
          <p className="text-center text-gray-300">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <p className="text-center text-gray-300">No applications to review.</p>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-cyan-400">{app.jobTitle}</h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      app.status.toLowerCase() === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : app.status.toLowerCase() === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
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
                    <p className="text-gray-300"><strong className="text-white">Name:</strong> {app.firstName} {app.lastName}</p>
                    <p className="text-gray-300"><strong className="text-white">Username:</strong> {app.username}</p>
                    <p className="text-gray-300"><strong className="text-white">Email:</strong> {app.email}</p>
                    <p className="text-gray-300"><strong className="text-white">Phone Number:</strong> {app.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-300"><strong className="text-white">Address:</strong> {app.address}</p>
                    <p className="text-gray-300"><strong className="text-white">Start Date:</strong> {app.startDate && !isNaN(new Date(app.startDate)) ? new Date(app.startDate).toLocaleDateString() : "Not provided"}</p>
                    <p className="text-gray-300">
                      <strong className="text-white">Cover Letter:</strong>{" "}
                      {app.coverLetter ? (
                        <a href={`http://localhost:5000/${app.coverLetter}`} className="text-cyan-400 hover:underline flex items-center">
                          <FaDownload className="mr-1" /> Download
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">Resume:</strong>{" "}
                      <a href={`http://localhost:5000/${app.resume}`} className="text-cyan-400 hover:underline flex items-center">
                        <FaDownload className="mr-1" /> Download
                      </a>
                    </p>
                  </div>
                </div>
                {app.status.toLowerCase() === "rejected" && app.rejectionReason && (
                  <p className="mt-4 text-red-400"><strong className="text-white">Rejection Reason:</strong> {app.rejectionReason}</p>
                )}
                {app.status.toLowerCase() === "pending" ? (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleAction(app, "approved")}
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-teal-600 transition-colors duration-300 font-medium flex items-center"
                      disabled={loading}
                    >
                      <FaCheckCircle className="mr-2" /> {loading ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => setSelectedApplicationId(app._id)}
                      className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-xl hover:from-pink-600 hover:to-red-600 transition-colors duration-300 font-medium flex items-center"
                      disabled={loading}
                    >
                      <FaTimesCircle className="mr-2" /> {loading ? "Processing..." : "Reject"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-400">Action not available for status: {app.status}</p>
                )}
                {selectedApplicationId === app._id && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Rejection *</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection"
                      className="w-full p-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                      rows="3"
                      required
                      disabled={loading}
                    />
                    <div className="mt-2 flex space-x-4">
                      <button
                        onClick={() => handleAction(app, "rejected")}
                        className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-xl hover:from-pink-600 hover:to-red-600 transition-colors duration-300 font-medium"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Submit Rejection"}
                      </button>
                      <button
                        onClick={() => setSelectedApplicationId(null)}
                        className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-2 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-colors duration-300 font-medium"
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