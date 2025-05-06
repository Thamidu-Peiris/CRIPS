const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  plantName: String,
  quantity: Number,
  status: String,
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
});

module.exports = mongoose.model('Order', orderSchema);
