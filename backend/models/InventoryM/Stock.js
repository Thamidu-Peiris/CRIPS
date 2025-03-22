const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  plantId: {
    type: String,
    required: true,
    trim: true
  },
  plantName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  expirationDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'out-of-stock'],
    default: 'active'
  }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Stock', stockSchema);
