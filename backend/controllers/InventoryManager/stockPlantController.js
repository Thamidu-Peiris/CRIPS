//backend\controllers\InventoryManager\stockPlantController.js
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

    const growerPlant = await Plant.findOne({ plantId }).lean();
    console.log("✅ Grower Plant Fetched:", growerPlant);

    if (!growerPlant) return res.status(404).json({ message: "Grower Plant not found" });

    const categoryFromPlant = growerPlant.speciesCategory || "Unknown";

    const newStock = new Stock({
      plantName: growerPlant.plantName,
      category: categoryFromPlant,
      quantity,
      itemPrice,
      expirationDate,
      itemType: "Plant",
      unit: "units",
    });

    const savedStock = await newStock.save();
    console.log("✅ Stock Saved:", savedStock);

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
    console.log("📡 Fetching all plant stocks...");
    const stocks = await Stock.find().lean();
    console.log("📊 Stocks fetched:", stocks.length);

    const uniquePlantNames = await Stock.distinct('plantName');
    const uniquePlantCount = uniquePlantNames.length;
    console.log("🌱 Unique plant names:", uniquePlantNames);
    console.log("🔢 Unique plant count:", uniquePlantCount);

    const enrichedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const plant = await Plant.findOne({ plantName: stock.plantName }).lean();
        console.log(`🔍 Plant lookup for ${stock.plantName}:`, plant ? "Found" : "Not found");
        return {
          ...stock,
          plantImage: plant?.plantImage || '/Uploads/default-plant.jpg',
          description: plant?.description || null,
        };
      })
    );

    const response = {
      stocks: enrichedStocks,
      uniquePlantCount,
    };
    console.log("📤 Sending response:", response);
    res.json(response);
  } catch (err) {
    console.error("❌ Error in getAllPlantStocks:", err);
    res.status(500).json({ message: 'Failed to fetch plant stocks', error: err.message });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    console.log("📡 Fetching plant by ID:", req.params.id);
    const stock = await Stock.findById(req.params.id).lean();
    if (!stock) {
      console.log("🚫 Stock not found");
      return res.status(404).json({ message: "Plant not found" });
    }

    const plant = await Plant.findOne({ plantName: stock.plantName }).lean();
    console.log("🔍 Plant lookup:", plant ? "Found" : "Not found");
    const response = {
      ...stock,
      plantImage: plant?.plantImage || '/Uploads/default-plant.jpg',
      category: stock.category || "Unknown",
      description: plant?.description || null,
    };
    res.json(response);
  } catch (err) {
    console.error("❌ Error in getPlantById:", err);
    res.status(500).json({ message: "Failed to fetch plant", error: err.message });
  }
};