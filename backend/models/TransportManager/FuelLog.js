const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true }, // Set default to current date
  liters: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  distance: { type: Number, required: true, min: 0 }, // Optional for fuel efficiency calculation
});

module.exports = mongoose.model('FuelLog', fuelSchema);