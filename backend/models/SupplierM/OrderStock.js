const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  plantName: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  approvedDate: { type: Date },
  shippedDate: { type: Date },
  statusHistory: [
    {
      status: { type: String },
      updatedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);