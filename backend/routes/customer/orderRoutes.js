// backend\routes\customer\orderRoutes.js
const express = require('express');
const router = express.Router();
const CustomerOrder = require('../../models/customer/CustomerOrder');
const Coupon = require('../../models/customer/Coupon');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    console.log("Received order request:", req.body);
    const { userId, items, shippingInfo, paymentMethod, couponCode } = req.body;

    // Validate required fields
    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingInfo || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Filter items to only include required fields
    const filteredItems = items.map(item => ({
      plantId: item.plantId || item._id, // Handle both cases
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

    console.log("Order to save:", order);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await CustomerOrder.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/:id/review', async (req, res) => {
  const { rating, review } = req.body;
  try {
    const order = await CustomerOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.reviews.push({ rating, review });
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;