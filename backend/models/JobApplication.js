const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true }, // Maps to role in employee models
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  plaintextPassword: { type: String }, // Temporary plaintext password
  startDate: { type: Date, required: true },
  coverLetter: { type: String },
  resume: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  status: { type: String, default: "pending" }, // "pending", "approved", "rejected"
  rejectionReason: { type: String }, // Reason for rejection (if applicable)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);