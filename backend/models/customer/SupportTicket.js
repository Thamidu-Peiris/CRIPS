// backend\models\customer\SupportTicket.js
const mongoose = require("mongoose");

const SupportTicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  orderId: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Responded", "Resolved"], default: "Pending" }, // Updated statuses
  responses: [
    {
      sender: { type: String, enum: ["Customer", "CSM"], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);