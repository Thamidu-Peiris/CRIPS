const CustomerOrder = require("../../models/customer/CustomerOrder");
const Coupon = require("../../models/customer/Coupon");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    const order = await CustomerOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// Get orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await CustomerOrder.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Get all orders (for CSM dashboard)
const getAllOrders = async (req, res) => {
  try {
    const orders = await CustomerOrder.find().populate('userId', 'firstName lastName email');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingInfo, paymentMethod, couponCode } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingInfo || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const filteredItems = items.map(item => ({
      plantId: item.plantId || item._id,
      plantName: item.plantName,
      quantity: item.quantity,
      itemPrice: item.itemPrice,
    }));

    let total = filteredItems.reduce((sum, item) => {
      if (!item.quantity || !item.itemPrice) {
        throw new Error("Invalid item data: quantity or itemPrice missing");
      }
      return sum + item.quantity * item.itemPrice;
    }, 0);
    let couponDiscount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon && coupon.isActive) {
        couponDiscount = (total * coupon.discountPercentage) / 100;
        total -= couponDiscount;
      }
    }

    const order = new CustomerOrder({
      userId,
      items: filteredItems,
      shippingInfo,
      total,
      paymentMethod,
      couponCode,
      couponDiscount,
      status: "Pending",
      statusHistory: [{ status: "Pending", updatedAt: new Date(), updatedBy: userId }],
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order status (for CSM)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, updatedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(updatedBy)) {
      return res.status(400).json({ message: "Valid orderId and updatedBy are required" });
    }

    if (!['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await CustomerOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Shipped" && !order.trackingNumber) {
      order.trackingNumber = `TRK-${uuidv4().slice(0, 8).toUpperCase()}`;
    }

    order.status = status;
    order.statusHistory.push({ status, updatedAt: new Date(), updatedBy });

    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// Update tracking location (for Transport Manager)
const updateTrackingLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingLocation, updatedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(updatedBy)) {
      return res.status(400).json({ message: "Valid orderId and updatedBy are required" });
    }

    if (!trackingLocation) {
      return res.status(400).json({ message: "Tracking location is required" });
    }

    const order = await CustomerOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ message: "Order must be Shipped or Delivered to update location" });
    }

    order.trackingLocation = trackingLocation;
    await order.save();
    res.status(200).json({ message: "Tracking location updated", order });
  } catch (error) {
    console.error("Error updating tracking location:", error);
    res.status(500).json({ message: "Failed to update tracking location", error: error.message });
  }
};

// Add review to order
const addReview = async (req, res) => {
  const { rating, review } = req.body;
  try {
    const order = await CustomerOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.reviews.push({ rating, review });
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  updateTrackingLocation,
  addReview,
};