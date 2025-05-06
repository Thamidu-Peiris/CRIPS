const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  backgroundImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vacancy', vacancySchema);