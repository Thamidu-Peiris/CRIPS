const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true }, // Unique shipment code
  vehicleId: String,            // Vehicle used
  driverId: String,             // Driver assigned
  status: { 
    type: String, 
    enum: ["Scheduled", "In Transit", "Delivered", "Delayed"], 
    default: "Scheduled" 
  }, // Status of the shipment
  departureDate: Date,          // When it leaves
  arrivalDate: Date,            // Actual Arrival Date
  expectedArrivalDate: Date,    // 🚀 For On-Time Delivery calculation
  lastUpdated: { type: Date, default: Date.now },

  // Optional: Add delayReason if you want to track
  delayReason: String
});

module.exports = mongoose.model('Shipment', shipmentSchema);
