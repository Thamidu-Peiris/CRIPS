// backend/controllers/InventoryM/OrderStockController.js
const Stock = require('../../models/InventoryM/Stock');
const Supplier = require('../../models/SupplierM/Supplier');
const Order = require('../../models/InventoryM/Order');

// Get all stock items (for dropdown)
exports.getStockItems = async (req, res) => {
  try {
    const stocks = await Stock.find().select('plantName itemType unit');
    res.status(200).json({ success: true, stocks });
  } catch (error) {
    console.error('Error fetching stock items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stock items' });
  }
};

// Get suppliers by item type
exports.getSuppliersByItem = async (req, res) => {
  const { itemType } = req.query;
  if (!itemType) {
    return res.status(400).json({ success: false, message: 'Item type is required' });
  }

  try {
    const suppliers = await Supplier.find({
      'supplies.itemType': itemType,
      status: 'approved',
    }).select('supplierId name companyName email contactNumber supplies');
    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch suppliers' });
  }
};

// Submit a new order
exports.submitOrder = async (req, res) => {
  const { plantName, quantity, unit, deliveryDate, supplierId } = req.body;
  const inventoryManagerId = req.user._id;

  if (!plantName || !quantity || !unit || !deliveryDate || !supplierId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const newOrder = new Order({
      itemType: plantName, // Use plantName as the item identifier in the order
      quantity,
      unit,
      deliveryDate,
      supplierId,
      inventoryManagerId,
      status: 'pending',
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order submitted successfully!' });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ success: false, message: 'Failed to submit order' });
  }
};