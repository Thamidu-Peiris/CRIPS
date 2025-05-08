const mongoose = require('mongoose');
const Order = require('../../models/InventoryM/OrderStock');
const SupplierProfile = require('../../models/SupplierM/SupplierProfile');
const Supplier = require('../../models/SupplierM/Supplier');
const Shipment = require('../../models/SupplierM/Shipment');

// Get all orders for the supplier
exports.getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    // Validate supplierId as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    const orders = await Order.find({ supplierId }).populate('supplierId inventoryManagerId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve the order (Accept action)
exports.acceptOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        status: 'confirmed',
        approvedDate: new Date(),
        $push: { statusHistory: { status: 'confirmed', updatedAt: new Date() } }
      },
      { new: true }
    ).populate('supplierId inventoryManagerId');
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order Accepted', updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a shipment (Add Supply action)
exports.createShipment = async (req, res) => {
  try {
    const { orderId, shipmentAddress } = req.body;

    // Validate orderId and shipmentAddress
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    if (!shipmentAddress) {
      return res.status(400).json({ message: 'Shipment address is required' });
    }

    // Fetch the order
    const order = await Order.findById(orderId).populate('supplierId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status to 'shipped'
    order.status = 'shipped';
    order.shippedDate = new Date();
    order.statusHistory.push({ status: 'shipped', updatedAt: new Date() });
    await order.save();

    // Create a new shipment record
    const shipment = new Shipment({
      orderId: order._id,
      supplierId: order.supplierId._id,
      supplierDetails: {
        name: order.supplierId.name,
        companyName: order.supplierId.companyName,
        contactNumber: order.supplierId.contactNumber,
        email: order.supplierId.email,
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

    // Populate the updated order for the response
    const updatedOrder = await Order.findById(orderId).populate('supplierId inventoryManagerId');
    res.status(200).json({ message: 'Shipment created successfully', updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get supplier profile
exports.getSupplierProfile = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    // Validate supplierId as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    const supplierProfile = await SupplierProfile.findOne({ supplierId }).populate('supplierId');
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
    // Validate supplierId as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    const { supplierName, supplierCompany, contactNo, shipmentAddress, bankDetails } = req.body;
    const updatedProfile = await SupplierProfile.findOneAndUpdate(
      { supplierId },
      {
        supplierName,
        supplierCompany,
        contactNo,
        shipmentAddress,
        bankDetails,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    ).populate('supplierId');
    res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};