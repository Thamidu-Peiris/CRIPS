const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true },
  address: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  businessAddress: { type: String },
  taxId: { type: String },
  profileImage: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'declined'] },
  approvedAt: { type: Date } // Add approvedAt field to track approval date
}, { timestamps: true }); // Ensure timestamps are enabled for createdAt and updatedAt

const User = mongoose.model('User', userSchema);
module.exports = User;