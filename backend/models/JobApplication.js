// CRIPS\backend\models\JobApplication.js
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  startDate: { type: Date, required: true },
  coverLetter: { type: String },
  resume: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  status: { type: String, default: "pending", lowercase: true },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);