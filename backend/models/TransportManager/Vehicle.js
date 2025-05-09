const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  temperatureControl: { type: Boolean, required: true },
  humidityControl: { type: Boolean, required: true },
  status: { type: String, required: true, enum: ['Active', 'Under Maintenance', 'Inactive'] },
  lastMaintenance: { type: Date },
  registrationNumber: { type: String, required: true },
  picture: { type: String, required: true }, // URL of the vehicle picture
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);