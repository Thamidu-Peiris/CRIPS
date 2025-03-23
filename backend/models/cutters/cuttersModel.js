// backend/models/cutters/cuttersModel.js
const mongoose = require("mongoose");

const cuttersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Cutters", required: true },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cutters", cuttersSchema);