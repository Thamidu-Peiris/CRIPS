
const express = require("express");
const router = express.Router();
const jobController = require("../../controllers/csm/jobController");

// Job Routes
router.get("/profile/:id", jobController.getProfileById);
router.put("/profile/update/:id", jobController.updateProfile);
router.post("/profile/change-password/:id", jobController.changePassword);
router.post("/apply", jobController.applyForJob);
router.post("/login", jobController.login);

module.exports = router;