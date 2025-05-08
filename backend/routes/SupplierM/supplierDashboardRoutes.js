const express = require('express');
const router = express.Router();
const supplierDashboardController = require('../../controllers/Supplier/supplierDashboardController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/suppliers directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/suppliers');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/suppliers/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Fetch supplier orders
router.get('/orders/:supplierId', supplierDashboardController.getSupplierOrders);

// Approve the order
router.put('/orders/:orderId/approve', supplierDashboardController.approveOrder);

// Ship the order
router.put('/orders/:orderId/ship', supplierDashboardController.shipOrder);

// Supplier profile routes
router.get('/profile/:supplierId', supplierDashboardController.getSupplierProfile);
router.put('/profile/:supplierId', upload.fields([{ name: 'image', maxCount: 1 }]), supplierDashboardController.updateSupplierProfile);

module.exports = router;