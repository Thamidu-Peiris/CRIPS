const mongoose = require("mongoose");

const termsAndPolicySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["terms", "privacy"], // Distinguishes between Terms and Conditions and Privacy Policy
    unique: true, // Ensures only one document per type
  },
  content: {
    type: String,
    required: true,
    default: "", // Default empty content
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String, // System Manager's username or ID
    required: true,
  },
});

module.exports = mongoose.model("TermsAndPolicy", termsAndPolicySchema);