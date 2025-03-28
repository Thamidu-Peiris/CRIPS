const express = require('express');
const router = express.Router();
const shipmentController = require('../../controllers/TransportManager/shipmentController');

router.get('/', shipmentController.getAllShipments);
router.post('/', shipmentController.createShipment);
router.put('/:id/status', shipmentController.updateShipmentStatus);
router.delete('/:id', shipmentController.deleteShipment);
router.get('/delivered', shipmentController.getDeliveredShipments);

// ✅ New Route to move scheduler to shipment status
router.post('/scheduler/:id/complete', shipmentController.moveToShipmentStatus);

module.exports = router;

