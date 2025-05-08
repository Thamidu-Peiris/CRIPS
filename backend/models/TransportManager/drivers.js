const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true }, // Unique driver ID, e.g., "DRV001"
  name: { type: String, required: true }, // Driver's full name
  email: { type: String, required: true, unique: true }, // Driver's email
  phoneNumber: { type: String, required: true }, // Driver's phone number
  licenseNumber: { type: String, required: true, unique: true }, // Driver's license number
  status: { 
    type: String, 
    enum: ['Available', 'On Duty', 'Inactive'], 
    default: 'Available' 
  }, // Driver's availability status
  profilePicture: { type: String }, // Path to the driver's profile picture
  createdAt: { type: Date, default: Date.now }, // When the driver was added
  updatedAt: { type: Date, default: Date.now }, // When the driver was last updated
});

// Update updatedAt field before saving
driverSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Driver', driverSchema);