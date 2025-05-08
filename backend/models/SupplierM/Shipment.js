const mongoose = require('mongoose');

// Define the shipment schema
const shipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderStock', required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  supplierDetails: {
    name: { type: String, required: true },
    companyName: { type: String },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
  },
  orderDetails: {
    itemType: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
  },
  shipmentAddress: { type: String, required: true },
  status: { type: String, enum: ['shipped', 'not shipped'], default: 'shipped' },
  createdAt: { type: Date, default: Date.now }
});

// Export the Shipment model, reusing it if already defined
module.exports = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);