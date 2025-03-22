
const mongoose = require("mongoose");

const InventoryManagerSchema = new mongoose.Schema({
  jobTitle: { type: String, default: "InventoryManager", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "InventoryManager", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InnventoryManager", InventoryManagerSchema);
