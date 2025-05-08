import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomerHeader from "../components/CustomerHeader";

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
    <div className="font-sans min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-12 transition-transform hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/careers"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Careers
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/privacy"
            className="text-green-700 font-bold text-lg hover:text-[#7ccc04] transition relative group"
          >
            Privacy
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm p-4 mx-4 mt-4 rounded-lg">
        <div className="text-gray-500 text-sm">
          <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> / Privacy Policy
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white shadow-lg p-12 mt-10 rounded-xl animate-fade-in">
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
          <div className="text-center">
            <h2 className="text-5xl font-extrabold text-[#63A302] mb-6">Privacy Policy</h2>
            <div className="prose prose-lg text-gray-700 whitespace-pre-wrap max-w-3xl mx-auto">
              {privacyContent || "No Privacy Policy available."}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Last updated: {privacyUpdatedAt ? new Date(privacyUpdatedAt).toLocaleString() : "Never"}</p>
              <p>Updated by: {privacyUpdatedBy || "Unknown"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-10 border-t-4 border-[#87de04]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 text-left">
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <p className="hover:text-green-400 transition cursor-pointer">Privacy Policy</p>
            <p className="hover:text-green-400 transition cursor-pointer">Terms of Use</p>
            <p className="hover:text-green-400 transition cursor-pointer">FAQs</p>
            <p className="hover:text-green-400 transition cursor-pointer">Shipping Policy</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p>
              📧{" "}
              <a href="mailto:support@aquaplants.com" className="hover:text-green-400 transition">
                support@aquaplants.com
              </a>
            </p>
            <p>📞 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:scale-110 transition transform">
                <img src="/facebook-icon.png" alt="Facebook" className="h-6" />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <img src="/instagram-icon.png" alt="Instagram" className="h-6" />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <img src="/twitter-icon.png" alt="Twitter" className="h-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <div className="flex rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 bg-gray-50 text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button className="bg-green-600 px-4 py-2 text-white hover:bg-green-700 hover:scale-105 transition rounded-r-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center">© 2025 AquaPlants. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Privacy;