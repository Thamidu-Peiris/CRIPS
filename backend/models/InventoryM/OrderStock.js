// backend/models/InventoryM/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  itemType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  inventoryManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plantId: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  approvedDate: { type: Date },
  shippedDate: { type: Date },
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
