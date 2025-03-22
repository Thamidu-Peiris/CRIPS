const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: String,
  type: String,
  lightRequirements: String,
  waterTemperature: String,
  pHRange: String,
  growthRate: String,
  price: Number,
  availability: String,
  growerInfo: String,
  certifications: [String],
  imageUrl: String,
  adminApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Plant", plantSchema);
