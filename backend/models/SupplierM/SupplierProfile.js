const mongoose = require('mongoose');

const supplierProfileSchema = new mongoose.Schema({
  supplierId: {
    type: String,
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
  shipmentAddress: {
    type: String,
    required: true,
  },
  bankDetails: {
    type: String,
    required: true,
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