//backend\controllers\customer\orderController.js
/* eslint-disable */
const CustomerOrder = require("../../models/customer/CustomerOrder");
const Coupon = require("../../models/customer/Coupon");
const Transaction = require("../../models/salesManager/FinancialModel");
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
const getOrdersByUserId = async (ereq, res) => {
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
    const { userId, items, shippingInfo, paymentMethod, couponCode, status } = req.body;

    console.log("Creating order with data:", { userId, items, shippingInfo, paymentMethod, couponCode, status });

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingInfo || !paymentMethod) {
      console.error("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId:", userId);
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
        console.error("Invalid item data:", item);
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
        console.log("Applied coupon:", couponCode, "Discount:", couponDiscount);
      } else {
        console.log("Invalid or inactive coupon:", couponCode);
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
      status: status || "Pending",
      statusHistory: [{ status: status || "Pending", updatedAt: new Date(), updatedBy: userId }],
    });

    const savedOrder = await order.save();
    console.log("Order created:", savedOrder._id, "Status:", savedOrder.status, "Total:", savedOrder.total);

    // Create a transaction if the order is completed
    if (savedOrder.status === "Completed") {
      try {
        const transaction = new Transaction({
          date: new Date(),
          income: savedOrder.total,
          expense: 0,
          balance: savedOrder.total,
        });
        const savedTransaction = await transaction.save();
        console.log("Transaction created for order:", savedOrder._id, "Transaction ID:", savedTransaction._id, "Income:", savedTransaction.income);
      } catch (transactionError) {
        console.error("Error creating transaction for order:", savedOrder._id, "Error:", transactionError.message);
      }
    } else {
      console.log("No transaction created for order:", savedOrder._id, "as status is:", savedOrder.status);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order status (for CSM)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, updatedBy } = req.body;

    console.log("Updating order status:", { orderId, status, updatedBy });

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(updatedBy)) {
      console.error("Invalid orderId or updatedBy:", { orderId, updatedBy });
      return res.status(400).json({ message: "Valid orderId and updatedBy are required" });
    }

    if (!['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed'].includes(status)) {
      console.error("Invalid status:", status);
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await CustomerOrder.findById(orderId);
    if (!order) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Shipped" && !order.trackingNumber) {
      order.trackingNumber = `TRK-${uuidv4().slice(0, 8).toUpperCase()}`;
      console.log("Assigned tracking number:", order.trackingNumber);
    }

    // Create a transaction if status changes to Completed
    if (status === "Completed" && order.status !== "Completed") {
      try {
        const transaction = new Transaction({
          date: new Date(),
          income: order.total,
          expense: 0,
          balance: order.total,
        });
        const savedTransaction = await transaction.save();
        console.log("Transaction created for order:", order._id, "Transaction ID:", savedTransaction._id, "Income:", savedTransaction.income);
      } catch (transactionError) {
        console.error("Error creating transaction for order:", order._id, "Error:", transactionError.message);
      }
    } else if (status === "Completed" && order.status === "Completed") {
      console.log("No transaction created for order:", order._id, "as status is already Completed");
    } else {
      console.log("No transaction created for order:", order._id, "as status is:", status);
    }

    order.status = status;
    order.statusHistory.push({ status, updatedAt: new Date(), updatedBy });

    await order.save();
    console.log("Order status updated:", order._id, "New Status:", status, "Total:", order.total);

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error.message);
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