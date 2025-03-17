//CRIPS\backend\routes\customer\contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/customer/contactController");

// Contact Routes
router.post("/contact", contactController.saveContactMessage);

module.exports = router;