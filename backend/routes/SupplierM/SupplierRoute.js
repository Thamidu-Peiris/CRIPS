const express = require('express');
const router = express.Router();
const { getSuppliers, addSupplier } = require('../../controllers/Supplier/supplierController');

router.get('/', getSuppliers);
router.post('/', addSupplier);

module.exports = router;
