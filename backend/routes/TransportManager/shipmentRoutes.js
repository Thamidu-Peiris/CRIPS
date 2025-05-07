const express = require('express');
const router = express.Router();
const shipmentController = require('../../controllers/TransportManager/shipmentController');

router.get('/', shipmentController.getAllShipments);
router.post('/', shipmentController.createShipment);
router.put('/:id', shipmentController.updateShipment); // Updated route for updating shipment
router.get('/delivered', shipmentController.getDeliveredShipments);
router.post('/scheduler/:id/complete', shipmentController.completeAndMoveSchedule);

module.exports = router;