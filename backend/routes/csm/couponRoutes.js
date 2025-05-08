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

router.put('/coupons/:id', async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;
    
    if (!code || !discountPercentage) {
      return res.status(400).json({ message: "Coupon code and discount percentage are required" });
    }
    
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({ message: "Discount percentage must be between 0 and 100" });
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { 
        code: code.toUpperCase(), 
        discountPercentage: parseFloat(discountPercentage),
      },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;