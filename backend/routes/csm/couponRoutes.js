// CRIPS\backend\routes\csm\couponRoutes.js
const express = require('express');
const router = express.Router();
const Coupon = require('../../models/customer/Coupon');

router.post('/coupons', async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;
    const coupon = new Coupon({ code, discountPercentage });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;