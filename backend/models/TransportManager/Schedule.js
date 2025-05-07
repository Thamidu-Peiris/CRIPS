const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true }, // Unique shipment code, e.g., "SHP001"
  orderIds: [{ type: String, required: true }], // List of orderIds in this schedule, e.g., ["ORD001", "ORD002"]
  vehicleId: { type: String, required: true }, // Vehicle used, e.g., "V001"
  driverId: { type: String, required: true }, // Driver assigned, e.g., "DRV001"
  departureDate: { type: Date, required: true }, // When the shipment leaves
  expectedArrivalDate: { type: Date, required: true }, // For on-time delivery calculation
  arrivalDate: { type: Date }, // Actual arrival date
  location: { type: String, default: null }, // Current location of the schedule, e.g., "Colombo"
  status: { 
    type: String, 
    enum: ["Scheduled", "In Progress", "Completed", "Delayed"], 
    default: "Scheduled" 
  }, // Status of the schedule
  delayReason: { type: String }, // Reason for delay, if any
  createdAt: { type: Date, default: Date.now }, // When the schedule was created
  lastUpdated: { type: Date, default: Date.now }, // When the schedule was last updated
});

// Update lastUpdated field before saving
scheduleSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema);