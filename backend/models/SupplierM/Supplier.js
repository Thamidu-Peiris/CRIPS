const mongoose = require('mongoose');
const supplierSchema = new mongoose.Schema({
  companyName: String,
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
  performanceRating: Number
});
module.exports = mongoose.model('Supplier', supplierSchema);
