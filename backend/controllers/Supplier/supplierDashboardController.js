const Order = require('../../models/InventoryM/OrderStock');
const SupplierProfile = require('../../models/SupplierM/SupplierProfile');

// Get all orders for the supplier
exports.getSupplierOrders = async (req, res) => {
  try {
    const orders = await Order.find({ supplierId: req.params.supplierId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve the order and log status history
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

// Get supplier profile
exports.getSupplierProfile = async (req, res) => {
  try {
    const supplierProfile = await SupplierProfile.findOne({ supplierId: req.params.supplierId });
    if (!supplierProfile) {
      return res.status(404).json({ message: 'Supplier profile not found' });
    }
    res.status(200).json(supplierProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update supplier profile
exports.updateSupplierProfile = async (req, res) => {
  try {
    const { supplierName, supplierCompany, contactNo, shipmentAddress, bankDetails } = req.body;
    const updatedProfile = await SupplierProfile.findOneAndUpdate(
      { supplierId: req.params.supplierId },
      {
        supplierName,
        supplierCompany,
        contactNo,
        shipmentAddress,
        bankDetails,
        updatedAt: new Date(),
      },
      { new: true, upsert: true } // upsert: true creates a new document if none exists
    );
    res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};