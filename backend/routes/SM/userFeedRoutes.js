const express = require("express");
const router = express.Router();
const {
  submitReview,
  getAllReviews,
  getApprovedReviews,
  updateReviewStatus,
  deleteReview,
} = require("../../controllers/SM/userFeedController");
const authMiddleware = require("../../middleware/auth");
const isSystemManager = require("../../middleware/isSystemManager");

// Submit a review (customers only)
router.post("/submit", authMiddleware, submitReview);

// Get all reviews (admin only)
router.get("/all", authMiddleware, isSystemManager, getAllReviews);

// Get approved reviews (public for homepage)
router.get("/approved", getApprovedReviews);

// Update review status (approve/reject, admin only)
router.put("/:id/status", authMiddleware, isSystemManager, updateReviewStatus);

// Delete a review (admin only)
router.delete("/:id", authMiddleware, isSystemManager, deleteReview);

module.exports = router;