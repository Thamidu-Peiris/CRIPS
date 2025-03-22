const express = require('express');
const { getStocks, addStock, updateStock, deleteStock } = require('../controllers/stockController');
const router = express.Router();

router.get('/', getStocks);
router.post('/', addStock);
router.put('/:id', updateStock);   // <-- Update Route
router.delete('/:id', deleteStock);

module.exports = router;
