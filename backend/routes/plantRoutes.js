const express = require("express");
const router = express.Router();
const PlantModel = require("../models/PlantModel");

// Route to GET all plants
router.get("/", async (req, res) => {
  try {
    const plants = await PlantModel.find();
    console.log("Plants from DB:", plants); // Log for debugging
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ message: "Error fetching plants" });
  }
});

// Route to GET a single plant by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Requested plant ID:", req.params.id);
    const plant = await PlantModel.findById(req.params.id);
    console.log("Found plant:", plant);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (error) {
    console.error("Error fetching plant:", error);
    res.status(500).json({ message: "Error fetching plant" });
  }
});

// Route to GET reviews for a specific plant
router.get("/:id/reviews", async (req, res) => {
  try {
    const plant = await PlantModel.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Route to POST a new plant
router.post("/", async (req, res) => {
  try {
    console.log("Received plant data:", req.body);
    const { name, price, image, category, description, stock, rating } = req.body;
    const newPlant = new PlantModel({ name, price, image, category, description, stock, rating });
    const savedPlant = await newPlant.save();
    console.log("Saved plant:", savedPlant);
    res.status(201).json(savedPlant);
  } catch (error) {
    console.error("Error adding plant:", error);
    res.status(500).json({ message: "Error adding plant" });
  }
});

module.exports = router;