const mongoose = require('mongoose');

const qualitySchema = new mongoose.Schema({
  shipmentId: { type: String, required: true },
  checkDate: { type: Date, default: Date.now },
  condition: { type: String, enum: ["Intact", "Damaged"], required: true },
  remarks: String,
});

module.exports = mongoose.model('QualityCheck', qualitySchema);
