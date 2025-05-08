const UserFeed = require("../../models/SM/userFeed");
const User = require("../../models/customer/User");

exports.submitReview = async (req, res) => {
    const { rating, review } = req.body;
    const user = req.user; // Now a full user object from authMiddleware
  
    try {
      // Ensure the user is a customer
      if (user.role !== "Customers") {
        return res.status(403).json({ success: false, message: "Only customers can submit reviews" });
      }
  
      // Validate input
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
      }
      if (!review || review.trim() === "") {
        return res.status(400).json({ success: false, message: "Review content cannot be empty" });
      }
  
      // Create a new review
      const newReview = new UserFeed({
        userId: user._id,
        firstName: user.firstName || "Anonymous",
        profileImage: user.profileImage || "/default-user.jpg",
        rating,
        review: review.trim(),
        status: "pending",
      });
  
      await newReview.save();
      res.status(201).json({ success: true, message: "Review submitted successfully. Awaiting admin approval." });
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({ success: false, message: "Error submitting review", error: error.message });
    }
  };
  
// Get all reviews (for admin)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await UserFeed.find().populate("userId", "email");
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
  }
};

// Get approved reviews (for homepage)
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await UserFeed.find({ status: "approved" });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching approved reviews", error: error.message });
  }
};

// Update review status (approve/reject by admin)
exports.updateReviewStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status. Must be 'approved' or 'rejected'" });
  }

  try {
    const review = await UserFeed.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: `Review ${status} successfully`, data: review });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: "Error updating review status", error: error.message });
  }
};

// Delete a review (admin only)
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await UserFeed.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Error deleting review", error: error.message });
  }
};