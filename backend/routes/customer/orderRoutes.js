// backend\routes\customer\orderRoutes.js
const express = require('express');
const router = express.Router();
const { getOrderById, getOrdersByUserId, getAllOrders, createOrder, updateOrderStatus, updateTrackingLocation, addReview } = require('../../controllers/customer/orderController');
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
    // Validate inputs
    if (!rating || !review || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating (1-5) and review text are required" });
    }
    const order = await CustomerOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== 'Completed') return res.status(400).json({ message: "Reviews can only be added to completed orders" });
    const newReview = { rating, review, status: 'pending' };
    order.reviews.push(newReview);
    await order.save();
    console.log("Review saved:", newReview, "for order:", order._id);
    res.status(201).json({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUserId);
router.get('/:id', getOrderById); 
router.get('/', getAllOrders); // For CSM dashboard
router.put('/:orderId/status', updateOrderStatus); // For CSM status updates
router.put('/:orderId/location', updateTrackingLocation); // For Transport Manager location updates
router.post('/:id/review', addReview);

module.exports = router;