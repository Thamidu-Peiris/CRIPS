// backend\models\TransportManager\TransportManagerModel.js
const mongoose = require("mongoose");

const TransportManagerSchema = new mongoose.Schema({
  jobTitle: { type: String, default: "TransportManager", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "TransportManager", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.TransportManager || mongoose.model("TransportManager", TransportManagerSchema);
