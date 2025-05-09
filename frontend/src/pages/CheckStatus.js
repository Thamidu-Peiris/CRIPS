import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const CheckStatus = () => {
  const [identifier, setIdentifier] = useState(""); // Email or username input
  const [status, setStatus] = useState(null); // Application status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setError("");
    setStatus(null);
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/api/jobs/application/status", {
        params: { email: identifier, username: identifier },
      });

      if (response.data.success) {
        setStatus(response.data.data.status);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
      setError(error.response?.data?.message || "Failed to check application status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-teal-50 to-blue-100">
      {/* Breadcrumb */}
      <div className="text-gray-500 mb-4 p-6">
        <Link to="/">Home</Link> / <Link to="/careers">Careers</Link> / Check Status
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-10">Check Application Status</h1>
        <p className="text-center text-gray-600 mb-12">
          Enter your email address or username to check the status of your job application.
        </p>

        {/* Form to Check Status */}
        <form onSubmit={handleCheckStatus} className="bg-white p-8 rounded-lg shadow-lg">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Email or Username *</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>
        </form>

        {/* Display Status */}
        {status && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Application Status</h3>
            <div className="flex justify-center items-center space-x-2">
              {status.toLowerCase() === "approved" && <FaCheckCircle className="text-green-600 text-2xl" />}
              {status.toLowerCase() === "pending" && <FaHourglassHalf className="text-yellow-600 text-2xl" />}
              {status.toLowerCase() === "rejected" && <FaTimesCircle className="text-red-600 text-2xl" />}
              <p
                className={`text-lg font-medium ${
                  status.toLowerCase() === "approved"
                    ? "text-green-600"
                    : status.toLowerCase() === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>
            {status.toLowerCase() === "pending" && (
              <p className="text-gray-600 mt-2">
                Your application is under review. Please check back later.
              </p>
            )}
            {status.toLowerCase() === "approved" && (
              <p className="text-gray-600 mt-2">
                Congratulations! Your application has been approved. You should have received an email with login details.
              </p>
            )}
            {status.toLowerCase() === "rejected" && (
              <p className="text-gray-600 mt-2">
                We’re sorry, your application was not accepted. Please check your email for more details.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStatus;