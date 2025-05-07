// CRIPS\backend\models\customer\CustomerOrder.js
const mongoose = require('mongoose');

const customerOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    plantId: { type: String, required: true },
    plantName: { type: String, required: true },
    quantity: { type: Number, required: true },
    itemPrice: { type: Number, required: true },
  }],
  shippingInfo: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String },
    address: { type: String },
  },
  total: { type: Number, required: true },
  paymentMethod: { type: String },
  couponCode: { type: String },
  couponDiscount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed'], 
    default: 'Pending' 
  },
  shipmentId: { type: String, default: null },
  trackingNumber: { type: String }, // New field for tracking number
  trackingLocation: { type: String }, // New field for current location
  statusHistory: [{
    status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed'] },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // CSM or Transport Manager
  }], // New field for status change history
  reviews: [{
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('CustomerOrder', customerOrderSchema);