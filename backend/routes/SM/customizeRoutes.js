const express = require("express");
const router = express.Router();
const { initializeTermsAndPolicy, getTermsAndPolicy, updateTermsAndPolicy } = require("../../controllers/SM/customizeController");
const authMiddleware = require("../../middleware/auth");
const isSystemManager = require("../../middleware/isSystemManager");

// Initialize default Terms and Policy (can be called on server startup or manually)
router.get("/initialize", authMiddleware, isSystemManager, initializeTermsAndPolicy);

// Get Terms and Conditions and Privacy Policy (public route for retrieval)
router.get("/", getTermsAndPolicy);

// Update Terms and Conditions or Privacy Policy (protected route)
router.put("/", authMiddleware, isSystemManager, updateTermsAndPolicy);

module.exports = router;