const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true },
  vehicleId: { type: String, required: true },
  driverId: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date },
  status: { type: String, enum: ["Scheduled", "In Progress", "Completed"], default: "Scheduled" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
