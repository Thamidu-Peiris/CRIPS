// backend/models/InventoryM/Stock.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  plantName: String,
  category: String,
  quantity: Number,
  expirationDate: Date,

  itemType: { type: String, default: 'Plant' }, // Added for ordering process
  unit: { type: String, default: 'units' }, // Added for ordering process
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);