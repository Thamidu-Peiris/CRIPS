// backend\models\GrowerHandler\Plant.js
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  plantId: {
    type: String,
    required: true,
    unique: true,
  },
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