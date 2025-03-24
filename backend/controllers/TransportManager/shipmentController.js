const Shipment = require('../../models/TransportManager/Shipment');
const Scheduler = require('../../models/TransportManager/Schedule'); // ✅ MISSING IN YOUR FILE


// Get all shipments
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ lastUpdated: -1 });
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
};

// Create a new shipment
exports.createShipment = async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);  // ✅ Handles expectedArrivalDate if sent
    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipment' });
  }
};

// ✅ Update shipment status + optional arrivalDate + delayReason
exports.updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, arrivalDate, delayReason } = req.body;

    const updated = await Shipment.findByIdAndUpdate(
      id,
      {
        status,
        arrivalDate: arrivalDate || undefined,
        delayReason: delayReason || undefined,
        lastUpdated: new Date()
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shipment status' });
  }
};

// Delete shipment
exports.deleteShipment = async (req, res) => {
  try {
    await Shipment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shipment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
};


exports.moveToShipmentStatus = async (req, res) => {
  try {
    console.log("🚀 Move API hit with Scheduler ID:", req.params.id);  // ✅ Log check
    const scheduled = await Scheduler.findById(req.params.id);
    if (!scheduled) return res.status(404).json({ error: 'Scheduled shipment not found' });

    const newShipment = await Shipment.create({
      shipmentId: scheduled.shipmentId,
      vehicleId: scheduled.vehicleId,
      driverId: scheduled.driverId,
      departureDate: scheduled.departureDate,
      expectedArrivalDate: req.body.expectedArrivalDate,
      status: "In Transit"
    });

    await Scheduler.findByIdAndDelete(req.params.id);
    console.log("✅ Moved to Shipment Status:", newShipment);
    res.status(200).json(newShipment);
  } catch (error) {
    console.error("❌ Error moving shipment:", error);
    res.status(500).json({ error: 'Failed to move shipment to status' });
  }
};