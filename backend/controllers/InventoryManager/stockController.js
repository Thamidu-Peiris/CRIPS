const Stock = require('../models/Stock');
exports.getStocks = async (req, res) => res.json(await Stock.find());
exports.addStock = async (req, res) => res.json(await new Stock(req.body).save());
exports.deleteStock = async (req, res) => res.json(await Stock.findByIdAndDelete(req.params.id));
