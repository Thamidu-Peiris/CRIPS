const PlantModel = require("../models/PlantModel");

// Get all plants
exports.getPlants = async (req, res) => {
  try {
    const plants = await PlantModel.find();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plants" });
  }
};

// Get a plant by ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await PlantModel.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plant" });
  }
};

// Add a new plant
exports.addPlant = async (req, res) => {
  try {
    const { name, price, image, category, description, stock, rating } = req.body;
    const newPlant = new PlantModel({ name, price, image, category, description, stock, rating });
    const savedPlant = await newPlant.save();
    res.status(201).json(savedPlant);
  } catch (error) {
    res.status(500).json({ message: "Error adding plant" });
  }
};

// Delete a plant
exports.deletePlant = async (req, res) => {
  try {
    const plant = await PlantModel.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting plant" });
  }
};