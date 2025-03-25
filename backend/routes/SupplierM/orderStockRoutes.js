const express = require('express');
const router = express.Router();
const orderStockController = require('../../controllers/Supplier/orderStockController');

// ✅ Get suppliers by supply category
router.get('/suppliers/:category', orderStockController.getSuppliersByCategory);

// ✅ Place a new stock order
router.post('/place-order', orderStockController.placeOrder);

module.exports = router;
