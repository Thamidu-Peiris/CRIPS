const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
  plantName: String,
  category: String,
  quantity: Number,
  expirationDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);