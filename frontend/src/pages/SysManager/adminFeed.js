import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../dashboards/SM/sideBar";
import { FaArrowLeft, FaHourglassHalf, FaStar, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";

const AdminFeed = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [managerName, setManagerName] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmReviewId, setConfirmReviewId] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState("");
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
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user-feed/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.response?.data?.message || "Failed to fetch reviews. Please try again.");
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
    fetchReviews();
  }, [navigate]);

  // Open Confirmation Modal for Approve/Reject/Delete
  const openConfirmModal = (reviewId, status, actionType = "status") => {
    setConfirmReviewId(reviewId);
    setConfirmStatus(status);
    if (actionType === "delete") {
      setConfirmAction(() => () => handleDelete(reviewId));
    } else {
      setConfirmAction(() => () => handleAction(reviewId, status));
    }
    setShowConfirmModal(true);
  };

  // Close Confirmation Modal
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmReviewId(null);
    setConfirmStatus("");
    setConfirmAction(null);
  };

  const handleAction = async (reviewId, status) => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/user-feed/${reviewId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccessMessage(`Review ${status} successfully!`);
        setReviews(reviews.map((r) => (r._id === reviewId ? { ...r, status } : r)));
      }
    } catch (error) {
      console.error(`Error ${status} review:`, error);
      setError(error.response?.data?.message || `Failed to ${status} review. Please try again.`);
    } finally {
      setLoading(false);
      closeConfirmModal();
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:5000/api/user-feed/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSuccessMessage("Review deleted successfully!");
        setReviews(reviews.filter((r) => r._id !== reviewId));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setError(error.response?.data?.message || "Failed to delete review. Please try again.");
    } finally {
      setLoading(false);
      closeConfirmModal();
    }
  };

  const ConfirmationModal = ({ onConfirm, onCancel, action, status }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Confirm Action</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to {action === "delete" ? "delete" : status.toLowerCase()} this review? {action === "delete" ? "This action cannot be undone." : ""}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onConfirm}
              className={`w-full py-3 rounded-xl transition duration-300 ${
                action === "delete" ? 'bg-red-500 hover:bg-red-600 text-white' :
                status === "approved" ? 'bg-green-500 hover:bg-green-600 text-white' :
                'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {action === "delete" ? "Delete" : status === "approved" ? "Approve" : "Reject"}
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
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
                System Manager Dashboard - User Reviews
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

        {/* Reviews List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-600">No reviews available.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={review.profileImage ? `http://localhost:5000${review.profileImage}` : "/default-user.jpg"}
                      alt={review.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => (e.target.src = "/default-user.jpg")}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">{review.firstName}</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      review.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : review.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    } flex items-center`}
                  >
                    {review.status === "approved" && <FaCheckCircle className="mr-1" />}
                    {review.status === "pending" && <FaHourglassHalf className="mr-1" />}
                    {review.status === "rejected" && <FaTimesCircle className="mr-1" />}
                    {review.status}
                  </span>
                </div>
                <p className="text-gray-600">{review.review}</p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Submitted: {new Date(review.createdAt).toLocaleString()}</p>
                </div>
                <div className="mt-4 flex space-x-4">
                  {review.status === "pending" && (
                    <>
                      <button
                        onClick={() => openConfirmModal(review._id, "approved")}
                        className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors duration-300 font-medium flex items-center"
                        disabled={loading}
                      >
                        <FaCheckCircle className="mr-2" /> {loading ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => openConfirmModal(review._id, "rejected")}
                        className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors duration-300 font-medium flex items-center"
                        disabled={loading}
                      >
                        <FaTimesCircle className="mr-2" /> {loading ? "Processing..." : "Reject"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => openConfirmModal(review._id, null, "delete")}
                    className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-medium flex items-center"
                    disabled={loading}
                  >
                    <FaTrash className="mr-2" /> {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <ConfirmationModal
            onConfirm={confirmAction}
            onCancel={closeConfirmModal}
            action={confirmStatus ? (confirmStatus === "approved" ? "approve" : "reject") : "delete"}
            status={confirmStatus}
          />
        )}
      </div>
    </div>
  );
};

export default AdminFeed;