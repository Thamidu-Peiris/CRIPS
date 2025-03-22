const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  plantName: { type: String, required: true },
  scientificName: { type: String, required: true },
  speciesCategory: { type: String, required: true },
  lightRequirement: { type: String, required: true },
  waterTemperatureMin: { type: Number, required: true },
  waterTemperatureMax: { type: Number, required: true },
  pHMin: { type: Number, required: true },
  pHMax: { type: Number, required: true },
  co2Requirement: { type: String, required: true },
  fertilizerRequirement: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  supplierName: { type: String, required: true },
  plantImage: { type: String },
  description: { type: String },
  plantBatchStatus: { type: String },
  plantAvailability: { type: String },
}, { timestamps: true });

const GrowerPlant = mongoose.model("GrowerPlant", plantSchema, "GrowerPlants");

export default GrowerPlant;