// CRIPS\backend\routes\SM\smRoute.js
const express = require("express");
const { loginSystemManager, registerSystemManager, updateProfile } = require("../../controllers/SM/smController");
const { getProfile } = require("../../controllers/SM/smProfileController");
const authMiddleware = require("../../middleware/auth");

const router = express.Router();

// Register a new system manager
router.post("/register", registerSystemManager);

// Get system manager profile
router.get("/profile", authMiddleware, getProfile);

// Update system manager profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;