const Shipment = require('../../models/TransportManager/Shipment');
const Scheduler = require('../../models/TransportManager/Schedule');

// Get all shipments
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ lastUpdated: -1 });
    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error.message);
    res.status(500).json({ error: 'Failed to fetch shipments: ' + error.message });
  }
};

// Create a new shipment
exports.createShipment = async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);
    console.log('Shipment created:', shipment);
    res.status(201).json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error.message);
    res.status(500).json({ error: 'Failed to create shipment: ' + error.message });
  }
};

// Update shipment status + optional arrivalDate + delayReason
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
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      console.log('Shipment not found:', id);
      return res.status(404).json({ error: 'Shipment not found' });
    }

    console.log('Shipment status updated:', updated);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating shipment status:', error.message);
    res.status(500).json({ error: 'Failed to update shipment status: ' + error.message });
  }
};

// Delete shipment
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) {
      console.log('Shipment not found:', req.params.id);
      return res.status(404).json({ error: 'Shipment not found' });
    }
    console.log('Shipment deleted:', shipment);
    res.status(200).json({ message: 'Shipment deleted' });
  } catch (error) {
    console.error('Error deleting shipment:', error.message);
    res.status(500).json({ error: 'Failed to delete shipment: ' + error.message });
  }
};

// Move schedule to shipment status
exports.completeAndMoveSchedule = async (req, res) => {
  try {
    console.log("🚀 Move API hit with Scheduler ID:", req.params.id);
    const scheduled = await Scheduler.findById(req.params.id);
    if (!scheduled) {
      console.log('Scheduled shipment not found:', req.params.id);
      return res.status(404).json({ error: 'Scheduled shipment not found' });
    }

    // Create a new shipment with "In Transit" status
    const newShipment = await Shipment.create({
      shipmentId: scheduled.shipmentId,
      orderIds: scheduled.orderIds,
      vehicleId: scheduled.vehicleId,
      driverId: scheduled.driverId,
      departureDate: scheduled.departureDate,
      expectedArrivalDate: scheduled.expectedArrivalDate,
      location: scheduled.location,
      status: "In Transit",
    });

    // Update associated orders to "Shipped" status (in case they weren't updated earlier)
    for (const orderId of scheduled.orderIds) {
      try {
        console.log(`Ensuring order ${orderId} is updated to Shipped with shipmentId ${scheduled.shipmentId}`);
        const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/update`, {
          status: 'Shipped',
          shipmentId: scheduled.shipmentId,
        });
        console.log(`Order ${orderId} updated successfully:`, response.data);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error.response?.data || error.message);
        return res.status(500).json({ error: `Failed to update order ${orderId}: ${error.response?.data?.error || error.message}` });
      }
    }

    // Delete the schedule
    await Scheduler.findByIdAndDelete(req.params.id);
    console.log("✅ Moved to Shipment Status:", newShipment);
    res.status(200).json(newShipment);
  } catch (error) {
    console.error("❌ Error moving shipment:", error.message);
    res.status(500).json({ error: 'Failed to move shipment to status: ' + error.message });
  }
};

// Fetch shipments with status "Delivered"
exports.getDeliveredShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ status: "Delivered" });
    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching delivered shipments:', error.message);
    res.status(500).json({ error: 'Failed to fetch delivered shipments: ' + error.message });
  }
};