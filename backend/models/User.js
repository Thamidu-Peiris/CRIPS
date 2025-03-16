const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true },
  address: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  businessAddress: { type: String },
  taxId: { type: String },
  profileImage: { type: String }
});

const User = mongoose.model('User', userSchema);
module.exports = User;