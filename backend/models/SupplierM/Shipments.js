const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  shippedDate: Date,
  status: String,
});

module.exports = mongoose.model('Shipment', shipmentSchema);
