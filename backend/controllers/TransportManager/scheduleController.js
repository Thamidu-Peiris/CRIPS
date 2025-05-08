const Schedule = require('../../models/TransportManager/Schedule');
const Shipment = require('../../models/TransportManager/Shipment');
const CustomerOrder = require('../../models/customer/CustomerOrder');
const Driver = require('../../models/TransportManager/drivers');
const Vehicle = require('../../models/TransportManager/Vehicle');

// Helper function to generate a unique shipmentId
const generateShipmentId = async () => {
  const prefix = 'SHP';
  const latestSchedule = await Schedule.findOne().sort({ createdAt: -1 });
  let newIdNumber = 1;
  if (latestSchedule && latestSchedule.shipmentId) {
    const number = parseInt(latestSchedule.shipmentId.replace(prefix, '')) || 0;
    newIdNumber = number + 1;
  }
  return `${prefix}${String(newIdNumber).padStart(3, '0')}`; // e.g., "SHP001"
};

// Create a new schedule with retry logic for unique shipmentId
exports.createSchedule = async (req, res) => {
  let schedule = null;
  const maxRetries = 5; // Maximum number of retries to generate a unique shipmentId
  let attempt = 0;

  try {
    const { orderIds, vehicleId, driverId, departureDate, expectedArrivalDate, location } = req.body;

    console.log('Create Schedule Request Body:', req.body);

    if (!orderIds || orderIds.length === 0) {
      console.log('Validation failed: Missing orderIds');
      return res.status(400).json({ error: 'At least one order must be selected' });
    }
    if (!vehicleId) {
      console.log('Validation failed: Missing vehicleId');
      return res.status(400).json({ error: 'Vehicle ID is required' });
    }
    if (!driverId) {
      console.log('Validation failed: Missing driverId');
      return res.status(400).json({ error: 'Driver ID is required' });
    }
    if (!departureDate) {
      console.log('Validation failed: Missing departureDate');
      return res.status(400).json({ error: 'Departure date is required' });
    }
    if (!expectedArrivalDate) {
      console.log('Validation failed: Missing expectedArrivalDate');
      return res.status(400).json({ error: 'Expected arrival date is required' });
    }
    if (!location) {
      console.log('Validation failed: Missing location');
      return res.status(400).json({ error: 'Initial location is required' });
    }

    // Validate driver availability based on departureDate
    const driver = await Driver.findOne({ driverId });
    if (!driver) {
      console.log('Validation failed: Invalid driverId:', driverId);
      return res.status(400).json({ error: `Invalid driverId: ${driverId}` });
    }

    const departureDateObj = new Date(departureDate);
    const activeDriverShipment = await Shipment.findOne({
      driverId,
      status: { $in: ['In Transit', 'Delayed'] },
    });

    if (activeDriverShipment) {
      const expectedArrivalDateObj = new Date(activeDriverShipment.expectedArrivalDate);
      if (departureDateObj <= expectedArrivalDateObj) {
        console.log('Validation failed: Driver is not available until after current shipment:', driverId);
        return res.status(400).json({
          error: `Driver ${driverId} is not available until after their current shipment ends on ${expectedArrivalDateObj.toISOString().split('T')[0]}`,
        });
      }
    } else if (driver.status !== 'Available') {
      console.log('Validation failed: Driver is not available:', driverId);
      return res.status(400).json({ error: `Driver ${driverId} is not available` });
    }

    // Validate vehicle availability based on departureDate
    const vehicle = await Vehicle.findOne({ vehicleId });
    if (!vehicle) {
      console.log('Validation failed: Invalid vehicleId:', vehicleId);
      return res.status(400).json({ error: `Invalid vehicleId: ${vehicleId}` });
    }
    if (vehicle.status !== 'Active') {
      console.log('Validation failed: Vehicle is not active:', vehicleId);
      return res.status(400).json({ error: `Vehicle ${vehicleId} is not active` });
    }

    const activeVehicleShipment = await Shipment.findOne({
      vehicleId,
      status: { $in: ['In Transit', 'Delayed'] },
    });

    if (activeVehicleShipment) {
      const expectedArrivalDateObj = new Date(activeVehicleShipment.expectedArrivalDate);
      if (departureDateObj <= expectedArrivalDateObj) {
        console.log('Validation failed: Vehicle is not available until after current shipment:', vehicleId);
        return res.status(400).json({
          error: `Vehicle ${vehicleId} is not available until after its current shipment ends on ${expectedArrivalDateObj.toISOString().split('T')[0]}`,
        });
      }
    }

    const orders = await CustomerOrder.find({ 
      _id: { $in: orderIds }, 
      status: { $regex: '^Confirmed$', $options: 'i' }
    });
    console.log('Valid orders for scheduling:', orders);

    if (orders.length !== orderIds.length) {
      const validOrderIds = orders.map(order => order._id.toString());
      const invalidOrderIds = orderIds.filter(id => !validOrderIds.includes(id.toString()));
      console.log('Validation failed: Some orderIds are invalid or not in Confirmed status:', invalidOrderIds);
      const existingOrders = await CustomerOrder.find({ _id: { $in: invalidOrderIds } });
      const detailedErrors = invalidOrderIds.map(id => {
        const order = existingOrders.find(o => o._id.toString() === id.toString());
        return order ? `Order ${id} has status ${order.status}` : `Order ${id} does not exist`;
      });
      return res.status(400).json({ 
        error: `Invalid orderIds or not in Confirmed status: ${invalidOrderIds.join(', ')}`,
        details: detailedErrors.join('; ')
      });
    }

    // Retry logic to ensure a unique shipmentId
    while (attempt < maxRetries) {
      try {
        const shipmentId = await generateShipmentId();

        schedule = await Schedule.create({
          shipmentId,
          orderIds,
          vehicleId,
          driverId,
          departureDate,
          expectedArrivalDate,
          location,
          status: 'Scheduled',
        });

        console.log('Schedule created successfully with shipmentId:', schedule.shipmentId);
        break; // Exit the retry loop on success
      } catch (error) {
        // Check if the error is a duplicate key error (E11000)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.shipmentId) {
          attempt++;
          console.log(`Duplicate shipmentId detected, retrying (${attempt}/${maxRetries})...`);
          if (attempt >= maxRetries) {
            console.error('Max retries reached for generating unique shipmentId');
            return res.status(500).json({ error: 'Failed to generate a unique shipmentId after multiple attempts' });
          }
          continue; // Retry with a new shipmentId
        }
        // If it's not a duplicate key error, throw the error to be caught by the outer try-catch
        throw error;
      }
    }

    console.log('Schedule created successfully:', schedule);

    for (const orderId of orderIds) {
      try {
        console.log(`Updating order ${orderId} to Shipped with shipmentId ${schedule.shipmentId}`);
        const updatedOrder = await CustomerOrder.findByIdAndUpdate(
          orderId,
          { status: 'Shipped', shipmentId: schedule.shipmentId },
          { new: true }
        );
        if (!updatedOrder) {
          console.error(`Order ${orderId} not found during update`);
          throw new Error(`Order ${orderId} not found during update`);
        }
        console.log(`Order ${orderId} updated successfully:`, updatedOrder);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error.message);
        if (schedule) {
          await Schedule.findByIdAndDelete(schedule._id);
          console.log('Rolled back schedule creation due to order update failure:', schedule._id);
        }
        return res.status(500).json({
          error: `Failed to update order ${orderId}: ${error.message}`,
        });
      }
    }

    // Update driver status to "On Duty"
    await Driver.findOneAndUpdate(
      { driverId },
      { status: 'On Duty' },
      { new: true }
    );

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error.message);
    if (schedule) {
      await Schedule.findByIdAndDelete(schedule._id);
      console.log('Rolled back schedule creation due to unexpected error:', schedule._id);
    }
    res.status(500).json({ error: 'Failed to create schedule: ' + error.message });
  }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ departureDate: 1 });

    const schedulesWithOrders = await Promise.all(
      schedules.map(async (schedule) => {
        try {
          console.log(`Fetching orders for schedule ${schedule.shipmentId} with orderIds:`, schedule.orderIds);
          const orders = [];
          for (const orderId of schedule.orderIds) {
            try {
              const order = await CustomerOrder.findById(orderId);
              console.log(`Fetched order ${orderId} for schedule ${schedule.shipmentId}:`, order);
              if (order) {
                orders.push(order);
              } else {
                console.warn(`Order ${orderId} not found for schedule ${schedule.shipmentId}`);
              }
            } catch (error) {
              console.error(`Failed to fetch order ${orderId} for schedule ${schedule.shipmentId}:`, error.message);
            }
          }
          console.log(`Orders for schedule ${schedule.shipmentId}:`, orders);
          return { ...schedule._doc, orders };
        } catch (error) {
          console.error(`Failed to fetch orders for schedule ${schedule.shipmentId}:`, error.message);
          return { ...schedule._doc, orders: [] };
        }
      })
    );

    res.status(200).json(schedulesWithOrders);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    res.status(500).json({ error: 'Failed to fetch schedules: ' + error.message });
  }
};

// Update schedule status and location
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, arrivalDate, delayReason } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      console.log('Schedule not found:', id);
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (location) updateData.location = location;
    if (arrivalDate) updateData.arrivalDate = arrivalDate;
    if (delayReason) updateData.delayReason = delayReason;

    console.log(`Updating schedule ${id} with data:`, updateData);

    const updatedSchedule = await Schedule.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedSchedule) {
      console.log('Schedule not found after update attempt:', id);
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const newStatus = status || updatedSchedule.status;
    const newLocation = location || updatedSchedule.location;
    for (const orderId of updatedSchedule.orderIds) {
      try {
        const orderStatus = newStatus === 'Completed' ? 'Delivered' : newStatus === 'Delayed' ? 'Shipped' : 'Shipped';
        console.log(`Updating order ${orderId} to ${orderStatus} with location ${newLocation}`);
        const updatedOrder = await CustomerOrder.findByIdAndUpdate(
          orderId,
          { status: orderStatus, trackingLocation: newLocation },
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

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error.message);
    res.status(500).json({ error: 'Failed to update schedule: ' + error.message });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      console.log('Schedule not found:', id);
      return res.status(404).json({ error: 'Schedule not found' });
    }

    for (const orderId of schedule.orderIds) {
      try {
        console.log(`Reverting order ${orderId} to Confirmed status`);
        const updatedOrder = await CustomerOrder.findByIdAndUpdate(
          orderId,
          { status: 'Confirmed', shipmentId: null, trackingLocation: null },
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

    // Revert driver status to "Available"
    await Driver.findOneAndUpdate(
      { driverId: schedule.driverId },
      { status: 'Available' },
      { new: true }
    );

    console.log(`Schedule ${schedule.shipmentId} deleted successfully`);
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (error) {
    console.error('Error deleting schedule:', error.message);
    res.status(500).json({ error: 'Failed to delete schedule: ' + error.message });
  }
};

// Get "Ready to Ship" orders (Confirmed orders)
exports.getReadyToShipOrders = async (req, res) => {
  try {
    const orders = await CustomerOrder.find({ status: { $regex: '^Confirmed$', $options: 'i' } });
    console.log('Ready-to-ship orders fetched:', orders);
    res.status(200).json(orders || []);
  } catch (error) {
    console.error('Error fetching ready-to-ship orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch ready-to-ship orders: ' + error.message });
  }
};

// Get available drivers
exports.getDrivers = async (req, res) => {
  try {
    const { departureDate } = req.query;
    console.log('Fetching drivers with departureDate:', departureDate);

    if (!departureDate) {
      console.log('Validation failed: Missing departureDate query parameter');
      return res.status(400).json({ error: 'departureDate query parameter is required' });
    }

    const departureDateObj = new Date(departureDate);
    if (isNaN(departureDateObj)) {
      console.log('Validation failed: Invalid departureDate format');
      return res.status(400).json({ error: 'Invalid departureDate format. Use ISO format (e.g., YYYY-MM-DD)' });
    }

    const allDrivers = await Driver.find();
    console.log('All drivers in database:', allDrivers);

    const availableDrivers = [];
    for (const driver of allDrivers) {
      const activeShipment = await Shipment.findOne({
        driverId: driver.driverId,
        status: { $in: ['In Transit', 'Delayed'] },
      });

      if (!activeShipment) {
        // Driver is available if not assigned to any active shipment and status is "Available"
        if (driver.status === 'Available') {
          availableDrivers.push(driver);
        }
        continue;
      }

      // If assigned to an active shipment, check if the new departureDate is after the expectedArrivalDate
      const expectedArrivalDateObj = new Date(activeShipment.expectedArrivalDate);
      if (departureDateObj > expectedArrivalDateObj) {
        availableDrivers.push(driver);
      }
    }

    console.log('Available drivers for departureDate:', availableDrivers);
    if (availableDrivers.length === 0) {
      console.warn('No drivers available for the given departureDate.');
    }

    res.status(200).json(availableDrivers);
  } catch (error) {
    console.error('Error fetching drivers:', error.message);
    res.status(500).json({ error: 'Failed to fetch drivers: ' + error.message });
  }
};

// Get available vehicles
exports.getAvailableVehicles = async (req, res) => {
  try {
    const { departureDate } = req.query;
    console.log('Fetching vehicles with departureDate:', departureDate);

    if (!departureDate) {
      console.log('Validation failed: Missing departureDate query parameter');
      return res.status(400).json({ error: 'departureDate query parameter is required' });
    }

    const departureDateObj = new Date(departureDate);
    if (isNaN(departureDateObj)) {
      console.log('Validation failed: Invalid departureDate format');
      return res.status(400).json({ error: 'Invalid departureDate format. Use ISO format (e.g., YYYY-MM-DD)' });
    }

    const allVehicles = await Vehicle.find();
    console.log('All vehicles in database:', allVehicles);

    const activeVehicles = await Vehicle.find({ status: 'Active' });
    console.log('Vehicles with status "Active":', activeVehicles);

    if (activeVehicles.length === 0) {
      console.warn('No vehicles with status "Active" found in the database.');
    }

    const availableVehicles = [];
    for (const vehicle of activeVehicles) {
      const activeShipment = await Shipment.findOne({
        vehicleId: vehicle.vehicleId,
        status: { $in: ['In Transit', 'Delayed'] },
      });

      if (!activeShipment) {
        // Vehicle is available if not assigned to any active shipment
        availableVehicles.push(vehicle);
        continue;
      }

      // If assigned to an active shipment, check if the new departureDate is after the expectedArrivalDate
      const expectedArrivalDateObj = new Date(activeShipment.expectedArrivalDate);
      if (departureDateObj > expectedArrivalDateObj) {
        availableVehicles.push(vehicle);
      }
    }

    console.log('Available vehicles for departureDate:', availableVehicles);
    if (availableVehicles.length === 0) {
      console.warn('No available vehicles after filtering for active shipments and departureDate.');
    }

    res.status(200).json(availableVehicles);
  } catch (error) {
    console.error('Error fetching available vehicles:', error.message);
    res.status(500).json({ error: 'Failed to fetch available vehicles: ' + error.message });
  }
};