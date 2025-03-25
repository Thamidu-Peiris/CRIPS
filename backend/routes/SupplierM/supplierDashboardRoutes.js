const express = require('express');
const router = express.Router();
const supplierDashboardController = require('../../controllers/Supplier/supplierDashboardController');

// Fetch supplier orders
router.get('/orders/:supplierId', supplierDashboardController.getSupplierOrders);

// Approve the order
router.put('/orders/:orderId/approve', supplierDashboardController.approveOrder);

// Ship the order
router.put('/orders/:orderId/ship', supplierDashboardController.shipOrder);


module.exports = router;
