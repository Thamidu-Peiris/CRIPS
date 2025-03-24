const mongoose = require('mongoose');

const environmentalDataSchema = new mongoose.Schema({
  plantName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Floating', 'Submerged', 'Emergent', 'Marginal', 'Mosses'],
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
    min: -10,
    max: 50,
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  lightLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  soilMoisture: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('EnvironmentalData', environmentalDataSchema);