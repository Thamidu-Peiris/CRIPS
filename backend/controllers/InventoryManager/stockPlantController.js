// backend\controllers\InventoryManager\stockPlantController.js
const Plant = require('../../models/GrowerHandler/Plant');
const Stock = require('../../models/InventoryM/Stock');

exports.addPlantStock = async (req, res) => {
  try {
    console.log("✅ Received Add Stock Body:", req.body);

    const { plantId, quantity, itemPrice, expirationDate } = req.body;

    // Validate required fields
    if (!plantId || !quantity || !itemPrice || !expirationDate) {
      return res.status(400).json({ message: "Plant ID, quantity, price, and expiration date are required" });
    }

    const growerPlant = await Plant.findOne({ plantId });
    console.log("✅ Grower Plant Fetched: ", growerPlant);

    if (!growerPlant) return res.status(404).json({ message: "Grower Plant not found" });

    const categoryFromPlant = growerPlant.speciesCategory || "Unknown";

    const newStock = new Stock({
      plantName: growerPlant.plantName,
      category: categoryFromPlant,
      quantity,
      itemPrice, // Save dynamic price
      expirationDate,
      itemType: "Plant",
      unit: "units",
    });

    const savedStock = await newStock.save();
    console.log("✅ Stock Saved: ", savedStock);

    const response = {
      ...savedStock._doc,
      plantImage: growerPlant.plantImage || null,
      description: growerPlant.description || null,
    };
    res.status(201).json(response);
  } catch (err) {
    console.error("❌ Error in addPlantStock:", err);
    res.status(500).json({ message: "Failed to add stock", error: err.message });
  }
};

exports.getAllPlantStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    const enrichedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const plant = await Plant.findOne({ plantName: stock.plantName });
        return {
          ...stock._doc,
          plantImage: plant?.plantImage || '/uploads/default-plant.jpg',
          description: plant?.description || null,
        };
      })
    );
    res.json(enrichedStocks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plant stocks', error: err.message });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Plant not found" });

    const plant = await Plant.findOne({ plantName: stock.plantName });
    const response = {
      ...stock._doc,
      plantImage: plant?.plantImage || '/uploads/default-plant.jpg',
      category: stock.category || "Unknown",
      description: plant?.description || null,
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plant", error: err.message });
  }
};