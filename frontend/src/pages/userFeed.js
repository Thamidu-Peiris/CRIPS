import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";

const UserFeed = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    console.log("UserInfo:", userInfo);
    console.log("Token:", token);
    if (!userInfo || userInfo.role !== "Customers" || !token) {
      console.log("Redirecting to login: Missing userInfo, token, or incorrect role");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get userInfo from localStorage to provide required fields
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      console.log("Submitting review with token:", token);
      console.log("User data for review:", {
        userId,
        firstName: userInfo?.firstName || "Anonymous",
        profileImage: userInfo?.profileImage || "/default-user.jpg",
      });

      const response = await axios.post(
        "http://localhost:5000/api/user-feed/submit",
        {
          userId,
          firstName: userInfo?.firstName || "Anonymous",
          profileImage: userInfo?.profileImage || "/default-user.jpg",
          rating,
          review,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccessMessage("Review submitted successfully! Awaiting admin approval.");
        setRating(0);
        setReview("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit review. Please try again.";
      setError(errorMessage);
      console.log("Error details:", {
        status: error.response?.status,
        message: errorMessage,
        response: error.response?.data,
      });
      // Only redirect on 401 (Unauthorized), not on 403 or other errors
      if (error.response?.status === 401) {
        console.log("Redirecting to login: Unauthorized");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
      // For other errors (like 403 or 500), show the error message without redirecting
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 font-sans">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-300 to-teal-500 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-green-900">
              Submit Your Review
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
        <Link to="/">Home</Link> / Submit Review
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
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

        {/* Review Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-green-900 mb-6">Share Your Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Rating *</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-2xl cursor-pointer transition-colors duration-200 ${
                      (hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Your Review *</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                rows="5"
                placeholder="Write your review here..."
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors duration-300 font-medium flex items-center"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFeed;