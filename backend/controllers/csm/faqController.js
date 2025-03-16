
const FAQ = require("../../models/csm/FaqModel");

// Get all FAQs
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new FAQ
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "Both question and answer are required" });
    }
    const newFaq = new FAQ({ question, answer });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing FAQ
const updateFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "Both question and answer are required" });
    }
    const updatedFaq = await FAQ.findByIdAndUpdate(req.params.id, { question, answer }, { new: true });
    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json(updatedFaq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an FAQ
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};