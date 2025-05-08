// backend\routes\SupplierM\SupplierRoute.js
const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/Supplier/supplierController'); // Adjusted path to Supplier
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/suppliers/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ✅ Dynamic supply registration with any number of images
router.post('/register', upload.any(), supplierController.registerSupplier);

// Get pending suppliers
router.get('/pending', supplierController.getPendingSuppliers);

// Approve/Reject supplier
router.put('/status/:id', supplierController.updateSupplierStatus);

router.get('/', supplierController.getAllSuppliers);


module.exports = router;