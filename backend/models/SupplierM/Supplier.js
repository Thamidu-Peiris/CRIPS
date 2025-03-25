const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  companyName: { type: String },
  username: { type: String, required: true, unique: true },  // ✅ Added username
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },

  supplies: [
    {
      itemType: { type: String, enum: ['Seed', 'Fertilizer', 'Cups', 'Media'], required: true },
      description: { type: String },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      photo: { type: String, required: true }
    }
  ],

  role: { type: String, default: 'supplier' },               // ✅ Role-based login
  password: { type: String, required: true },                // ✅ Password for login
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);
