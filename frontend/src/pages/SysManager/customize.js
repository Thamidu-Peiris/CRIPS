import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../dashboards/SM/sideBar";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const Customize = () => {
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [termsUpdatedAt, setTermsUpdatedAt] = useState(null);
  const [privacyUpdatedAt, setPrivacyUpdatedAt] = useState(null);
  const [termsUpdatedBy, setTermsUpdatedBy] = useState(null);
  const [privacyUpdatedBy, setPrivacyUpdatedBy] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [managerName, setManagerName] = useState("");
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
    if (!userInfo || userInfo.role !== "SystemManager") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTermsAndPolicy = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/customize", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTermsContent(response.data.data.terms);
        setPrivacyContent(response.data.data.privacy);
        setTermsUpdatedAt(response.data.data.termsUpdatedAt);
        setPrivacyUpdatedAt(response.data.data.privacyUpdatedAt);
        setTermsUpdatedBy(response.data.data.termsUpdatedBy);
        setPrivacyUpdatedBy(response.data.data.privacyUpdatedBy);
      } catch (error) {
        console.error("Error fetching Terms and Policy:", error);
        setError(error.response?.data?.message || "Failed to fetch Terms and Policy. Please try again.");
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
    fetchTermsAndPolicy();
  }, [navigate]);

  const handleUpdate = async (type, content) => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/customize",
        { type, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccessMessage(`${type === "terms" ? "Terms and Conditions" : "Privacy Policy"} updated successfully!`);
        if (type === "terms") {
          setTermsContent(content);
          setTermsUpdatedAt(new Date());
          setTermsUpdatedBy(managerName);
        } else {
          setPrivacyContent(content);
          setPrivacyUpdatedAt(new Date());
          setPrivacyUpdatedBy(managerName);
        }
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      setError(error.response?.data?.message || `Failed to update ${type === "terms" ? "Terms and Conditions" : "Privacy Policy"}. Please try again.`);
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
    <div className="flex min-h-screen bg-teal-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-teal-300 to-teal-500 text-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-green-900">
                System Manager Dashboard - Customize Terms & Policies
              </h1>
              <p className="text-xl mt-2 font-light text-gray-100">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate("/sm-dashboard")}
              className="flex items-center bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-xl">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Terms and Conditions Section */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="space-y-6">
            {/* Terms and Conditions */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Terms and Conditions</h3>
              <textarea
                value={termsContent}
                onChange={(e) => setTermsContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                rows="10"
                placeholder="Enter Terms and Conditions..."
              />
              <div className="mt-2 text-sm text-gray-600">
                <p>Last updated: {termsUpdatedAt ? new Date(termsUpdatedAt).toLocaleString() : "Never"}</p>
                <p>Updated by: {termsUpdatedBy || "Unknown"}</p>
              </div>
              <button
                onClick={() => handleUpdate("terms", termsContent)}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors duration-300 font-medium flex items-center"
                disabled={loading}
              >
                <FaSave className="mr-2" /> {loading ? "Saving..." : "Save Terms and Conditions"}
              </button>
            </div>

            {/* Privacy Policy */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Privacy Policy</h3>
              <textarea
                value={privacyContent}
                onChange={(e) => setPrivacyContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                rows="10"
                placeholder="Enter Privacy Policy..."
              />
              <div className="mt-2 text-sm text-gray-600">
                <p>Last updated: {privacyUpdatedAt ? new Date(privacyUpdatedAt).toLocaleString() : "Never"}</p>
                <p>Updated by: {privacyUpdatedBy || "Unknown"}</p>
              </div>
              <button
                onClick={() => handleUpdate("privacy", privacyContent)}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors duration-300 font-medium flex items-center"
                disabled={loading}
              >
                <FaSave className="mr-2" /> {loading ? "Saving..." : "Save Privacy Policy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customize;