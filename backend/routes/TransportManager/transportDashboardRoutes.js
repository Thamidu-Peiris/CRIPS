// backend\routes\TransportManager\transportDashboardRoutes.js
const express = require('express');
const router = express.Router();
const Shipment = require('../../models/TransportManager/Shipment');
const FuelLog = require('../../models/TransportManager/FuelLog');

// 🚀 GET Transport Dashboard Stats (CALCULATED)
router.get('/dashboard-stats', async (req, res) => {
  try {
    // 🚚 Active Shipments count
    const activeShipments = await Shipment.countDocuments({ status: "In Transit" });

    // ⛽ Fuel Efficiency Calculation (example: total distance / total fuel)
    const fuelLogs = await FuelLog.find({});
    let totalLiters = 0;
    let totalDistance = 0; // Optional: Add distance in your FuelLog model later
    fuelLogs.forEach(log => {
      totalLiters += log.liters;
      totalDistance += log.distance || 0; // If distance field exists
    });
    let fuelEfficiency = totalDistance && totalLiters ? (totalDistance / totalLiters).toFixed(2) : 8.5; // Default dummy value

    // 📈 On-Time Delivery %
    const deliveredShipments = await Shipment.find({ status: "Delivered" });
    let onTime = 0;
    deliveredShipments.forEach(shipment => {
      if (shipment.arrivalDate && shipment.arrivalDate <= shipment.expectedArrivalDate) {
        onTime++;
      }
    });
    const onTimeDelivery = deliveredShipments.length > 0
      ? ((onTime / deliveredShipments.length) * 100).toFixed(2)
      : 0;

    res.json({
      activeShipments,
      fuelEfficiency,
      onTimeDelivery
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch transport stats" });
  }
});

module.exports = router;
