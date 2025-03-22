const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  performanceRating: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  }
}, { timestamps: true });  // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Supplier', supplierSchema);
