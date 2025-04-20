const CustomerOrder = require("../../models/customer/CustomerOrder");
const Coupon = require("../../models/customer/Coupon");
const mongoose = require("mongoose");

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query parameter
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    const order = await CustomerOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify user ownership
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
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
  createOrder,
  addReview,
};