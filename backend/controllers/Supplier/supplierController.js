const Supplier = require('../../models/SupplierM/Suppliermodel');

exports.getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
};

exports.addSupplier = async (req, res) => {
  const supplier = new Supplier(req.body);
  await supplier.save();
  res.json(supplier);
};

exports.updateSupplier = async (req, res) => {
  const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteSupplier = async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.send('Supplier Deleted');
};