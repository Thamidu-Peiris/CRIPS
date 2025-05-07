const express = require("express");
const router = express.Router();
const growerHandlerController = require("../../controllers/GrowerHandler/growerHandlerController");

// Grower Handler Routes
router.get("/profile/:id", growerHandlerController.getProfileById);
router.put("/profile/update/:id", growerHandlerController.updateProfile);
router.post("/profile/change-password/:id", growerHandlerController.changePassword);
router.post("/apply", growerHandlerController.applyForJob);
router.post("/login", growerHandlerController.login);

module.exports = router;