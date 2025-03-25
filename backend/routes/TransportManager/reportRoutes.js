const express = require('express');
const router = express.Router();
const Shipment = require('../../models/TransportManager/Shipment');
const FuelLog = require('../../models/TransportManager/FuelLog');

// Completed Shipments Summary
router.get('/shipment-summary', async (req, res) => {
  const summary = await Shipment.aggregate([
    { $match: { status: 'Delivered' } },
    { $group: { _id: { $month: "$arrivalDate" }, count: { $sum: 1 } } },
    { $sort: { "_id": 1 } }
  ]);
  res.json(summary);
});

// Fuel Cost Summary
router.get('/fuel-summary', async (req, res) => {
  const summary = await FuelLog.aggregate([
    { $group: { _id: { $month: "$date" }, totalFuelCost: { $sum: "$cost" } } },
    { $sort: { "_id": 1 } }
  ]);
  res.json(summary);
});

module.exports = router;
