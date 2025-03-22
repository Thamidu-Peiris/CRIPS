const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
  plantId: String,
  plantName: String,
  category: String,
  quantity: Number,
  expirationDate: Date,
  status: String,
});
module.exports = mongoose.model('Stock', stockSchema);
