const Supplier = require('../models/Supplier');
exports.getSuppliers = async (req, res) => res.json(await Supplier.find());
exports.addSupplier = async (req, res) => res.json(await new Supplier(req.body).save());
exports.updateSupplier = async (req, res) => res.json(await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteSupplier = async (req, res) => res.json(await Supplier.findByIdAndDelete(req.params.id));
