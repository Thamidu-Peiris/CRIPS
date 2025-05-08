// backend\models\InventoryM\Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    plantId: { type: String, required: true },
    plantName: { type: String, required: true },
    quantity: { type: Number, required: true },
    itemPrice: { type: Number, required: true },
  }],
  shippingInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    address: { type: String, required: true },
  },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed'], 
    default: 'Pending' 
  },
  shipmentId: { type: String, default: null }, // Added to store the shipmentId
  couponDiscount: { type: Number, default: 0 },
  reviews: [{
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);