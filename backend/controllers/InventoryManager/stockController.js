const Stock = require('../models/Stock');

// ✅ Get All Stocks
exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stocks', error: err.message });
  }
};

// ✅ Add New Stock
exports.addStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add stock', error: err.message });
  }
};

// ✅ Update Stock by ID
exports.updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStock) return res.status(404).json({ message: 'Stock not found' });
    res.json(updatedStock);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update stock', error: err.message });
  }
};

// ✅ Delete Stock by ID
exports.deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete stock', error: err.message });
  }
};

