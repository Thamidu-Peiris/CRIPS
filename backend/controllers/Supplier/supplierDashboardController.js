const mongoose = require('mongoose');
const OrderStock = require('../../models/InventoryM/OrderStock');
const Shipment = require('../../models/SupplierM/Shipment');
const SupplierProfile = require('../../models/SupplierM/SupplierProfile');

// Get all orders for the supplier (for InventoryOrders.js)
exports.getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    const orders = await OrderStock.find({ supplierId }).populate('inventoryManagerId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve the order (Accept action for InventoryOrders.js)
exports.approveOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderStock.findByIdAndUpdate(
      req.params.orderId,
      {
        status: 'accepted',
        approvedDate: new Date(),
        $push: { statusHistory: { status: 'accepted', updatedAt: new Date() } }
      },
      { new: true }
    ).populate('inventoryManagerId');
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order Accepted', updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ship the order (Add Supply action for InventoryOrders.js)
exports.shipOrder = async (req, res) => {
  try {
    const { shipmentAddress, name, companyName, contactNumber, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    if (!shipmentAddress) {
      return res.status(400).json({ message: 'Shipment address is required' });
    }
    if (!name || !contactNumber || !email) {
      return res.status(400).json({ message: 'Supplier name, contact number, and email are required' });
    }

    const order = await OrderStock.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'shipped';
    order.shippedDate = new Date();
    order.statusHistory.push({ status: 'shipped', updatedAt: new Date() });
    await order.save();

    const shipment = new Shipment({
      orderId: order._id,
      supplierId: order.supplierId,
      supplierDetails: {
        name,
        companyName,
        contactNumber,
        email,
      },
      orderDetails: {
        itemType: order.itemType,
        quantity: order.quantity,
        unit: order.unit,
        deliveryDate: order.deliveryDate,
      },
      shipmentAddress,
      status: 'shipped'
    });

    await shipment.save();

    const updatedOrder = await OrderStock.findById(req.params.orderId).populate('inventoryManagerId');
    res.status(200).json({ message: 'Order Shipped and Added to Shipment List', updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get supplier profile
exports.getSupplierProfile = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    const supplierProfile = await SupplierProfile.findOne({ supplierId });
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
    const supplierId = req.params.supplierId;
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }

    const { supplierName, supplierCompany, contactNo, email, shipmentAddress, bankDetails } = req.body;

    const updatedProfile = await SupplierProfile.findOneAndUpdate(
      { supplierId },
      {
        supplierName,
        supplierCompany,
        contactNo,
        email,
        shipmentAddress,
        bankDetails,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    console.log('Updated profile in backend:', updatedProfile);
    res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: err.message });
  }
};