import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ReviewManagement = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching pending reviews from /api/csm/customers/reviews/pending");
      const response = await axios.get("http://localhost:5000/api/csm/customers/reviews/pending");
      console.log("Pending reviews response:", response.data);
      setPendingReviews(response.data);
    } catch (error) {
      const errorMessage = error.response
        ? `Error ${error.response.status}: ${error.response.data.message || "Request failed"}`
        : `Network error: ${error.message}`;
      console.error("Error fetching pending reviews:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleApproveReview = async (orderId, reviewId) => {
    try {
      await axios.put(`http://localhost:5000/api/csm/customers/reviews/${orderId}/${reviewId}/approve`);
      setPendingReviews(pendingReviews.filter(review => review._id !== reviewId));
      alert("Review approved successfully.");
    } catch (error) {
      console.error("Error approving review:", error.response?.data || error.message);
      alert(`Failed to approve review: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRejectReview = async (orderId, reviewId) => {
    try {
      await axios.put(`http://localhost:5000/api/csm/customers/reviews/${orderId}/${reviewId}/reject`);
      setPendingReviews(pendingReviews.filter(review => review._id !== reviewId));
      alert("Review rejected successfully.");
    } catch (error) {
      console.error("Error rejecting review:", error.response?.data || error.message);
      alert(`Failed to reject review: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRetry = () => {
    fetchPendingReviews();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Pending Reviews</h2>
      <div className="max-w-7xl mx-auto">
        {loading && (
          <p className="text-center text-gray-600 mb-4">Loading pending reviews...</p>
        )}
        {error && (
          <div className="text-center text-red-600 mb-4">
            <p>{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && pendingReviews.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-left text-gray-800 font-semibold">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Plant</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Review</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((review, index) => (
                  <motion.tr
                    key={review._id}
                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="p-4">{review.orderId}</td>
                    <td className="p-4">
                      {review.user ? `${review.user.firstName} ${review.user.lastName}` : "Unknown User"}
                    </td>
                    <td className="p-4">{review.items.map(item => item.plantName).join(", ")}</td>
                    <td className="p-4">{review.rating} ★</td>
                    <td className="p-4">{review.review}</td>
                    <td className="p-4">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleApproveReview(review.orderId, review._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectReview(review.orderId, review._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading && !error ? (
          <p className="text-center text-gray-600">No pending reviews found.</p>
        ) : null}
      </div>
    </div>
  );
};

export default ReviewManagement;