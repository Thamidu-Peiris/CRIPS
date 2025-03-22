// CRIPS\frontend\src\pages\AdminApplications.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Check if the user is a System Manager
  useEffect(() => {
    let userInfo;
    try {
      userInfo = JSON.parse(localStorage.getItem("userInfo"));
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
    <div className="font-sans min-h-screen bg-gradient-to-b from-teal-50 to-blue-100">
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
          CRIPS
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
          <Link to="/check-status" className="text-gray-600">Check Status</Link>
        </div>
        <CustomerHeader />
      </nav>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-10">System Manager Dashboard - Job Applications</h1>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-center text-green-600 mb-4">{successMessage}</p>}
        {loading ? (
          <p className="text-center text-gray-600">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-600">No applications to review.</p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-green-600 mb-2">{app.jobTitle}</h3>
                <p><strong>Name:</strong> {app.firstName} {app.lastName}</p>
                <p><strong>Username:</strong> {app.username}</p>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Phone Number:</strong> {app.phoneNumber}</p>
                <p><strong>Address:</strong> {app.address}</p>
                <p><strong>Start Date:</strong> {app.startDate && !isNaN(new Date(app.startDate)) ? new Date(app.startDate).toLocaleDateString() : "Not provided"}</p>
                <p><strong>Cover Letter:</strong> {app.coverLetter ? <a href={`http://localhost:5000/${app.coverLetter}`} className="text-green-600 hover:underline">Download</a> : "Not provided"}</p>
                <p><strong>Resume:</strong> <a href={`http://localhost:5000/${app.resume}`} className="text-green-600 hover:underline">Download</a></p>
                <p><strong>Status:</strong> {app.status}</p>
                {app.status && app.status.toLowerCase() === "rejected" && app.rejectionReason && (
                  <p><strong>Rejection Reason:</strong> {app.rejectionReason}</p>
                )}
                {console.log("Application status for", app._id, ":", app.status)}
                {app.status && app.status.toLowerCase() === "pending" ? (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleAction(app._id, "approved")}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => setSelectedApplicationId(app._id)}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Reject"}
                    </button>
                  </div>
                ) : (
                  app.status && <p className="mt-4 text-gray-500">Action not available for status: {app.status}</p>
                )}
                {selectedApplicationId === app._id && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Reason for Rejection *</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
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