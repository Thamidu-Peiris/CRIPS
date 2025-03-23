
// CRIPS\backend\controllers\GrowerHandler\plantController.js
const { GrowerPlantModel, CategoryModel } = require("../../models/GrowerHandler/Plant");

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new CategoryModel({ name, description });
    const savedCategory = await newCategory.save();

    console.log("Saved category:", savedCategory);
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Error adding category" });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// Edit a category
exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name, description, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Updated category:", updatedCategory);
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).json({ message: "Error editing category" });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Deleted category:", deletedCategory);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
};

// Get all plants
exports.getPlants = async (req, res) => {
  try {
    const plants = await GrowerPlantModel.find().populate("category").sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ message: "Error fetching plants" });
  }
};

// Get a plant by ID
exports.getPlantById = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await GrowerPlantModel.findById(id).populate("category");
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.status(200).json(plant);
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    res.status(500).json({ message: "Error fetching plant" });
  }
};

// Get reviews for a plant
exports.getPlantReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await GrowerPlantModel.findById(id).populate("reviews"); // Assuming reviews are a ref field in the Plant model
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.status(200).json(plant.reviews || []);
  } catch (error) {
    console.error("Error fetching plant reviews:", error);
    res.status(500).json({ message: "Error fetching plant reviews" });
  }
};

// Add a new plant
exports.addPlant = async (req, res) => {
  try {
    console.log("Received plant data:", req.body);
    const { name, price, image, category, description, stock } = req.body;

    const categoryExists = await CategoryModel.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newPlant = new GrowerPlantModel({ name, price, image, category, description, stock });
    const savedPlant = await newPlant.save();
    console.log("Saved plant:", savedPlant);
    res.status(201).json(savedPlant);
  } catch (error) {
    console.error("Error adding plant:", error);
    res.status(500).json({ message: "Error adding plant" });
  }
};

// Delete a plant
exports.deletePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlant = await GrowerPlantModel.findByIdAndDelete(id);
    if (!deletedPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    console.log("Deleted plant:", deletedPlant);
    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ message: "Error deleting plant" });
  }
};