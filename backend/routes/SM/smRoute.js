// CRIPS\backend\routes\SM\smRoute.js
const express = require("express");
const {
  registerSystemManager,
  updateProfile,
  getProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/SM/smController"); // Import all functions
const authMiddleware = require("../../middleware/auth"); // Use authMiddleware

const router = express.Router();

// Register a new system manager
router.post("/register", registerSystemManager);

// Get system manager profile
router.get("/profile", authMiddleware, getProfile);

// Update system manager profile
router.put("/profile", authMiddleware, updateProfile);

// New routes for employee management
router.get("/employees", authMiddleware, getAllEmployees);
router.get("/employees/:role/:id", authMiddleware, getEmployeeById);
router.put("/employees/:role/:id", authMiddleware, updateEmployee);
router.delete("/employees/:role/:id", authMiddleware, deleteEmployee);

module.exports = router;