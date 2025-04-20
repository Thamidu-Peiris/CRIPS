// backend\models\SM\Visitor.js
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitTime: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
  }
});

module.exports = mongoose.model('Visitor', visitorSchema);
