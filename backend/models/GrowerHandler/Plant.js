const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const plantSchema = new mongoose.Schema({
  plantName: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    required: true,
  },
  speciesCategory: {
    type: String,
    enum: ['Floating', 'Submerged', 'Emergent', 'Marginal', 'Mosses'],
    required: true,
  },
  lightRequirement: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  waterTemperatureMin: {
    type: Number,
    required: true,
  },
  waterTemperatureMax: {
    type: Number,
    required: true,
  },
  pHMin: {
    type: Number,
    required: true,
  },
  pHMax: {
    type: Number,
    required: true,
  },
  co2Requirement: {
    type: String,
  },
  fertilizerRequirement: {
    type: String,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  supplierName: {
    type: String,
    required: true,
  },
  plantImage: {
    type: String,
  },
  description: {
    type: String,
  },
  plantBatchStatus: {
    type: String,
  },
  plantAvailability: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Plant', plantSchema, 'growerplants');
