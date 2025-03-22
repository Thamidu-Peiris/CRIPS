//CRIPS\backend\routes\customer\supportRoutes.js
const express = require("express");
const router = express.Router();
const supportController = require("../../controllers/customer/supportController"); // Import support controller
const faqController = require("../../controllers/csm/faqController"); // Import FAQ controller

// Support Ticket Routes
router.post("/support", supportController.createSupportTicket);
router.get("/support", supportController.getAllSupportTickets);
router.get("/support/:id", supportController.getSupportTicketById);
router.put("/support/:id", supportController.updateSupportTicket);
router.put("/support/:id/reply", supportController.addReplyToTicket);
router.put("/support/:id/status", supportController.updateTicketStatus);
router.delete("/support/:id", supportController.deleteSupportTicket);

// FAQ Routes
router.get("/faqs", faqController.getAllFAQs);
router.post("/faqs", faqController.createFAQ);
router.put("/faqs/:id", faqController.updateFAQ);
router.delete("/faqs/:id", faqController.deleteFAQ);

module.exports = router;