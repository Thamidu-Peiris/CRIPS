// CRIPS\backend\routes\jobRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const {
  submitJobApplication,
  getAllApplications,
  updateApplicationStatus,
  checkApplicationStatus,
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/auth"); // Import the auth middleware
const isSystemManager = require("../middleware/isSystemManager"); // Import the isSystemManager middleware

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, PNG, and PDF files are allowed"));
  },
});

// Validate ObjectId middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid application ID" });
  }
  next();
};

// Routes
router.post(
  "/apply",
  upload.fields([
    { name: "coverLetter", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  submitJobApplication
);

// Protect routes with authMiddleware and isSystemManager
router.get("/applications", authMiddleware, isSystemManager, getAllApplications); // Only SystemManager can access
router.put("/applications/:id", authMiddleware, isSystemManager, validateObjectId, updateApplicationStatus); // Only SystemManager can update

// Public route for checking application status
router.get("/application/status", checkApplicationStatus);

module.exports = router;