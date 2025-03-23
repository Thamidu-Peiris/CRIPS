const Supplier = require('../models/Supplier');
exports.getSuppliers = async (req, res) => res.json(await Supplier.find());
exports.addSupplier = async (req, res) => res.json(await new Supplier(req.body).save());