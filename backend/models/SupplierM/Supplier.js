const mongoose = require('mongoose');
const supplierSchema = new mongoose.Schema({
  supplierName: String,
  plantId: String,
  plantName: String,
  quantity: Number,
  location: String,
  payment: Number
}, { timestamps: true });
module.exports = mongoose.model('Supplier', supplierSchema);
