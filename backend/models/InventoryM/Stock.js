// backend/models/InventoryM/Stock.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  plantName: String,
  category: String,
  quantity: Number,
  itemPrice: Number, // Added for dynamic pricing
  expirationDate: Date,
  itemType: { type: String, default: 'Plant' },
  unit: { type: String, default: 'units' },
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);