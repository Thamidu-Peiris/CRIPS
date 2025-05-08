import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Privacy = () => {
  const [privacyContent, setPrivacyContent] = useState("");
  const [privacyUpdatedAt, setPrivacyUpdatedAt] = useState(null);
  const [privacyUpdatedBy, setPrivacyUpdatedBy] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get("http://localhost:5000/api/customize");
        setPrivacyContent(response.data.data.privacy);
        setPrivacyUpdatedAt(response.data.data.privacyUpdatedAt);
        setPrivacyUpdatedBy(response.data.data.privacyUpdatedBy);
      } catch (error) {
        console.error("Error fetching Privacy Policy:", error);
        setError(error.response?.data?.message || "Failed to fetch Privacy Policy. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrivacy();
  }, []);

  return (
    <div className="min-h-screen bg-teal-50 font-sans">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-300 to-teal-500 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-green-900">
              Privacy Policy
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl transition duration-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto text-gray-500 mb-4 p-6">
        <Link to="/">Home</Link> / Privacy Policy
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}

        {/* Privacy Content */}
        {loading ? (
          <p className="text-center text-gray-600">Loading Privacy Policy...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Privacy Policy</h2>
            <div className="prose prose-lg text-gray-700 whitespace-pre-wrap">
              {privacyContent || "No Privacy Policy available."}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Last updated: {privacyUpdatedAt ? new Date(privacyUpdatedAt).toLocaleString() : "Never"}</p>
              <p>Updated by: {privacyUpdatedBy || "Unknown"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Privacy;