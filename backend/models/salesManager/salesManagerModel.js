// backend/models/salesManager/salesManagerModel.js
const mongoose = require("mongoose");

const salesManagerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Sales Manager", required: true },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SalesManager", salesManagerSchema);