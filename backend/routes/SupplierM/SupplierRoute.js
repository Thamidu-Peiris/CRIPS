const express = require('express');
const { getSuppliers, addSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const router = express.Router();

router.get('/', getSuppliers);
router.post('/', addSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;
