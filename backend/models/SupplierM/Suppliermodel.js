// backend/models/growerHandler/growerHandlerModel.js
const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  jobTitle: { type: String, default: "Supplier", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Supplier", required: true },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
