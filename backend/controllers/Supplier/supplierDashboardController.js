
// backend\controllers\Supplier\supplierDashboardController.js
const Order = require('../../models/InventoryM/OrderStock'); // Use the correct Order model


//const Order = require('../../controllers/Supplier/orderStockController');
const Supplier = require('../../models/SupplierM/Supplier');
// Get all orders for the supplier
exports.getSupplierOrders = async (req, res) => {
  try {
    const orders = await Order.find({ supplierId: req.params.supplierId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Approve the order and log status history
exports.approveOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        status: 'confirmed',
        approvedDate: new Date(),
        $push: { statusHistory: { status: 'confirmed', updatedAt: new Date() } }
      },
      { new: true }
    );
    res.status(200).json({ message: 'Order Approved', updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ship the order and log status history
exports.shipOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        status: 'shipped',
        shippedDate: new Date(),
        $push: { statusHistory: { status: 'shipped', updatedAt: new Date() } }
      },
      { new: true }
    );
    res.status(200).json({ message: 'Order Shipped', updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
