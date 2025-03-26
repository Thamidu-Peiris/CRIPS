const Supplier = require('../../models/SupplierM/Supplier');
const Order = require('../../models/InventoryM/OrderStock');

// ✅ Get suppliers by supply category (Seed, Fertilizer, Cups, Media)
exports.getSuppliersByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const suppliers = await Supplier.find({
      status: 'approved',
      'supplies.itemType': category
    });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
};

// ✅ Place new stock order
exports.placeOrder = async (req, res) => {
  try {
    const {
      itemType,
      quantity,
      unit,
      deliveryDate,
      supplierId,
      inventoryManagerId,
      plantId
    } = req.body;

    const newOrder = new Order({
      itemType,
      quantity,
      unit,
      deliveryDate,
      supplierId,
      inventoryManagerId,
      plantId,
      statusHistory: [{ status: 'pending' }]
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};
