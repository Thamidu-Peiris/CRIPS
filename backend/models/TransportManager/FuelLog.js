const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  vehicleId: String,
  date: Date,
  liters: Number,
  cost: Number,
  distance: Number // ✅ Optional for fuel efficiency calculation
});

module.exports = mongoose.model('FuelLog', fuelSchema);
