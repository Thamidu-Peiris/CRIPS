const express = require("express");
const router = express.Router();
const salesManagerController = require("../../controllers/SalesManager/salesManagerController");

// Sales Manager Routes
router.get("/profile/:id", salesManagerController.getProfileById);
router.put("/profile/update/:id", salesManagerController.updateProfile);
router.post("/profile/change-password/:id", salesManagerController.changePassword);
router.post("/apply", salesManagerController.applyForJob);
router.post("/login", salesManagerController.login);

module.exports = router;