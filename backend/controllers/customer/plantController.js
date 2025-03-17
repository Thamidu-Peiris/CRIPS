//CRIPS\backend\controllers\customer\plantController.js
const PlantModel = require("../../models/customer/PlantModel");

// Get all plants
exports.getPlants = async (req, res) => {
  try {
    const plants = await PlantModel.find();
    console.log("Plants from DB:", plants); // Added logging
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error); // Improved logging
    res.status(500).json({ message: "Error fetching plants" });
  }
};

// Get a plant by ID
exports.getPlantById = async (req, res) => {
  try {
    console.log("Requested plant ID:", req.params.id); // Added logging
    const plant = await PlantModel.findById(req.params.id);
    console.log("Found plant:", plant); // Added logging
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (error) {
    console.error("Error fetching plant:", error); // Improved logging
    res.status(500).json({ message: "Error fetching plant" });
  }
};

// Add a new plant
exports.addPlant = async (req, res) => {
  try {
    console.log("Received plant data:", req.body); // Added logging
    const { name, price, image, category, description, stock, rating } = req.body;
    const newPlant = new PlantModel({ name, price, image, category, description, stock, rating });
    const savedPlant = await newPlant.save();
    console.log("Saved plant:", savedPlant); // Added logging
    res.status(201).json(savedPlant);
  } catch (error) {
    console.error("Error adding plant:", error); // Improved logging
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
    console.error("Error deleting plant:", error); // Improved logging
    res.status(500).json({ message: "Error deleting plant" });
  }
};

// Get reviews for a specific plant (New function)
exports.getPlantReviews = async (req, res) => {
  try {
    const plant = await PlantModel.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    console.log("Fetched reviews for plant:", plant.reviews); // Added logging
    res.json(plant.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};