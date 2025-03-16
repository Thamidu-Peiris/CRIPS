// E:\SLIIT\Y2 S2\CRIPS\backend\controllers\contactController.js
const ContactMessage = require("../../models/customer/ContactMessage");

// Save contact message to MongoDB
const saveContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = {
  saveContactMessage,
};