const express = require('express');
const router = express.Router();
const qualityController = require('../../controllers/TransportManager/qualityCheckController');

// Log a new quality check
router.post('/', qualityController.logQualityCheck);

// Get history of quality checks for a shipment
router.get('/:shipmentId', qualityController.getQualityHistory);

module.exports = router;
