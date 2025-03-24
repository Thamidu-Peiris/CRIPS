// backend/models/salesManager/CustomerModel.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalPurchases: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // e.g., "Credit Card", "Bank", "PayPal"
  lastPurchaseDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);