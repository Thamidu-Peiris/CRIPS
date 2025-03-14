const express = require("express");
const router = express.Router();
const SupportTicket = require("../models/SupportTicket");
const FAQ = require("../models/FaqModel");  // ✅ Import FAQ Model

// 🚀 Existing Support Ticket Routes (DO NOT MODIFY)
router.post("/support", async (req, res) => {
    try {
        const { name, email, subject, message, orderId, status, response } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const ticket = new SupportTicket({ name, email, subject, message, orderId, status, response });
        await ticket.save();
        res.status(201).json({ message: "Support ticket created!", ticket });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.get("/support", async (req, res) => {
    try {
        const tickets = await SupportTicket.find();
        res.json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/support/:id", async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json(ticket);
    } catch (error) {
        console.error("Error fetching ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/support/:id", async (req, res) => {
    try {
        const { status, response } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        if (status) ticket.status = status;
        if (response) ticket.responses.push({ sender: "CSM", message: response });
        await ticket.save();
        res.json({ message: "Ticket updated successfully!", updatedTicket: ticket });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Error updating ticket", error });
    }
});

router.put("/support/:id/reply", async (req, res) => {
    try {
      const { message, sender } = req.body;
      const ticket = await SupportTicket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  
      ticket.responses.push({ sender, message });
  
      // Automatically update status to "Responded" if it was "Pending"
      if (ticket.status === "Pending") {
        ticket.status = "Responded";
      }
  
      await ticket.save();
      res.json({ message: "Reply added successfully!", responses: ticket.responses });
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ message: "Error adding reply", error });
    }
  });


router.put("/support/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const ticket = await SupportTicket.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      res.json(ticket);
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Error updating status", error });
    }
  });

  router.delete("/support/:id", async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        res.json({ message: "Ticket deleted successfully!" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// 🚀 FAQ MANAGEMENT ROUTES (Knowledge Base)

// 📌 Get All FAQs
router.get("/faqs", async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 📌 Create a New FAQ
router.post("/faqs", async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Both question and answer are required." });
        }
        const newFaq = new FAQ({ question, answer });
        await newFaq.save();
        res.status(201).json(newFaq);
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 📌 Update an Existing FAQ
router.put("/faqs/:id", async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Both question and answer are required." });
        }
        const updatedFaq = await FAQ.findByIdAndUpdate(req.params.id, { question, answer }, { new: true });
        if (!updatedFaq) {
            return res.status(404).json({ message: "FAQ not found." });
        }
        res.json(updatedFaq);
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 📌 Delete an FAQ
router.delete("/faqs/:id", async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found." });
        }
        res.json({ message: "FAQ deleted successfully." });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
