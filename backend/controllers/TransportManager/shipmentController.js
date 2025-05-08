const Shipment = require('../../models/TransportManager/Shipment');
const Schedule = require('../../models/TransportManager/Schedule');
const CustomerOrder = require('../../models/customer/CustomerOrder');
const Driver = require('../../models/TransportManager/drivers');

// Get all shipments
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ lastUpdated: -1 });
    const shipmentsWithOrders = await Promise.all(
      shipments.map(async (shipment) => {
        const orders = await CustomerOrder.find({ _id: { $in: shipment.orderIds } });
        return { ...shipment._doc, orders };
      })
    );
    res.status(200).json(shipmentsWithOrders);
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

// Update shipment status, location, arrivalDate, or delayReason
exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, arrivalDate, delayReason } = req.body;

    const shipment = await Shipment.findById(id);
    if (!shipment) {
      console.log('Shipment not found:', id);
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Prevent status updates if the shipment is already "Delivered"
    if (status && shipment.status === 'Delivered') {
      console.log(`Cannot update status for delivered shipment ${id}`);
      return res.status(400).json({ error: 'Cannot update status for a delivered shipment' });
    }

    // Prevent location updates if the shipment is "Delivered"
    if (location && shipment.status === 'Delivered') {
      console.log(`Cannot update location for delivered shipment ${id}`);
      return res.status(400).json({ error: 'Cannot update location for a delivered shipment' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (location) updateData.location = location;
    if (arrivalDate) updateData.arrivalDate = arrivalDate;
    if (delayReason) updateData.delayReason = delayReason;

    console.log(`Updating shipment ${id} with data:`, updateData);

    const updatedShipment = await Shipment.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedShipment) {
      console.log('Shipment not found after update attempt:', id);
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Sync the updated status and location with associated orders
    const newStatus = status || updatedShipment.status;
    const newLocation = location || updatedShipment.location;
    for (const orderId of updatedShipment.orderIds) {
      try {
        const orderStatus = newStatus === 'Delivered' ? 'Delivered' : newStatus === 'Delayed' ? 'Shipped' : 'Shipped';
        console.log(`Updating order ${orderId} to ${orderStatus} with location ${newLocation}`);
        const updatedOrder = await CustomerOrder.findByIdAndUpdate(
          orderId,
          { 
            status: orderStatus, 
            trackingLocation: newLocation,
            ...(orderStatus === 'Delivered' && { trackingNumber: updatedShipment.trackingNumber || `TRK-${updatedShipment.shipmentId}` })
          },
          { new: true }
        );
        if (!updatedOrder) {
          console.error(`Order ${orderId} not found during update`);
          throw new Error(`Order ${orderId} not found during update`);
        }
        console.log(`Order ${orderId} updated successfully:`, updatedOrder);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error.message);
        return res.status(500).json({ error: `Failed to update order ${orderId}: ${error.message}` });
      }
    }

    // If shipment is marked as "Delivered", revert driver status to "Available"
    if (newStatus === 'Delivered') {
      await Driver.findOneAndUpdate(
        { driverId: updatedShipment.driverId },
        { status: 'Available' },
        { new: true }
      );
    }

    res.status(200).json(updatedShipment);
  } catch (error) {
    console.error('Error updating shipment:', error.message);
    res.status(500).json({ error: 'Failed to update shipment: ' + error.message });
  }
};

// Move schedule to shipment status
exports.completeAndMoveSchedule = async (req, res) => {
  try {
    console.log("🚀 Move API hit with Scheduler ID:", req.params.id);
    const scheduled = await Schedule.findById(req.params.id);
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

    // Ensure associated orders are updated to "Shipped" status
    for (const orderId of scheduled.orderIds) {
      try {
        console.log(`Ensuring order ${orderId} is updated to Shipped with shipmentId ${scheduled.shipmentId}`);
        const updatedOrder = await CustomerOrder.findByIdAndUpdate(
          orderId,
          { status: 'Shipped', shipmentId: scheduled.shipmentId, trackingLocation: scheduled.location },
          { new: true }
        );
        if (!updatedOrder) {
          console.error(`Order ${orderId} not found during update`);
          throw new Error(`Order ${orderId} not found during update`);
        }
        console.log(`Order ${orderId} updated successfully:`, updatedOrder);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error.message);
        return res.status(500).json({ error: `Failed to update order ${orderId}: ${error.message}` });
      }
    }

    // Delete the schedule
    await Schedule.findByIdAndDelete(req.params.id);
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
    const shipmentsWithOrders = await Promise.all(
      shipments.map(async (shipment) => {
        const orders = await CustomerOrder.find({ _id: { $in: shipment.orderIds } });
        return { ...shipment._doc, orders };
      })
    );
    res.status(200).json(shipmentsWithOrders);
  } catch (error) {
    console.error('Error fetching delivered shipments:', error.message);
    res.status(500).json({ error: 'Failed to fetch delivered shipments: ' + error.message });
  }
};