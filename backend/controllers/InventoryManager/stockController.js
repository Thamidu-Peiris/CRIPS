const Stock = require('../models/Stock');

// GET - Fetch all stocks
exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST - Add new stock
exports.addStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    await newStock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT - Update stock by ID
exports.updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the updated document
    );
    res.status(200).json(updatedStock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE - Delete stock by ID
exports.deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

