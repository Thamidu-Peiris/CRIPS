const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const GrowerPlantModel = mongoose.models.GrowerPlant || mongoose.model("GrowerPlant", plantSchema);
const CategoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = { GrowerPlantModel, CategoryModel };