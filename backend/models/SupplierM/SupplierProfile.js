const mongoose = require('mongoose');

const supplierProfileSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
    unique: true,
  },
  supplierName: {
    type: String,
    required: true,
  },
  supplierCompany: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  shipmentAddress: {
    type: String,
    required: false, // Not required during registration
    default: '',
  },
  bankDetails: {
    type: String,
    required: false, // Not required during registration
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SupplierProfile', supplierProfileSchema);