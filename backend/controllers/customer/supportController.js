// E:\SLIIT\Y2 S2\CRIPS\backend\controllers\supportController.js
const SupportTicket = require("../../models/customer/SupportTicket");

// Create a new support ticket
const createSupportTicket = async (req, res) => {
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
};

// Get all support tickets
const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find();
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single support ticket by ID
const getSupportTicketById = async (req, res) => {
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
};

// Update a support ticket
const updateSupportTicket = async (req, res) => {
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
};

// Add a reply to a support ticket
const addReplyToTicket = async (req, res) => {
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
};

// Update support ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Delete a support ticket
const deleteSupportTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json({ message: "Ticket deleted successfully!" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  addReplyToTicket,
  updateTicketStatus,
  deleteSupportTicket,
};