// CRIPS\backend\routes\InventoryM\StockPlantRoute.js
const express = require('express');
const router = express.Router();
const stockPlantController = require('../../controllers/InventoryManager/stockPlantController');

router.post('/addPlantStock', stockPlantController.addPlantStock);
router.get('/allPlantStocks', stockPlantController.getAllPlantStocks);
router.get('/plant/:id', stockPlantController.getPlantById);

module.exports = router;