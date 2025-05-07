// backend/models/TransportManager/Shipment.js
const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true }, // Unique shipment code, e.g., "SHP001"
  orderIds: [{ type: String, required: true }], // List of orderIds in this shipment, e.g., ["ORD001", "ORD002"]
  vehicleId: { type: String, required: true }, // Vehicle used, e.g., "V001"
  driverId: { type: String, required: true }, // Driver assigned, e.g., "DRV001"
  status: { 
    type: String, 
    enum: ["Scheduled", "In Transit", "Delivered", "Delayed"], 
    default: "Scheduled" 
  }, // Status of the shipment
  location: { type: String, default: null }, // Current location of the shipment, e.g., "Colombo"
  departureDate: { type: Date, required: true }, // When the shipment leaves
  arrivalDate: { type: Date }, // Actual arrival date
  expectedArrivalDate: { type: Date, required: true }, // For on-time delivery calculation
  createdAt: { type: Date, default: Date.now }, // When the shipment was created
  lastUpdated: { type: Date, default: Date.now }, // When the shipment was last updated
  delayReason: { type: String }, // Reason for delay, if any
});

// Update lastUpdated field before saving
shipmentSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);