const Stock = require('../models/Stock');
exports.getStocks = async (req, res) => res.json(await Stock.find());
exports.addStock = async (req, res) => res.json(await new Stock(req.body).save());
exports.updateStock = async (req, res) => res.json(await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteStock = async (req, res) => res.json(await Stock.findByIdAndDelete(req.params.id));
