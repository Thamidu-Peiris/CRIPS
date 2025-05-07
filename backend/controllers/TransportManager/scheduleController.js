const Schedule = require('../../models/TransportManager/Schedule');
const axios = require('axios');

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

// Simulated drivers (for consistency with frontend)
const simulatedDrivers = [
  { _id: 'DRV001', name: 'John Doe', status: 'Available' },
  { _id: 'DRV002', name: 'Jane Smith', status: 'Available' },
];

// Create a new schedule
exports.createSchedule = async (req, res) => {
  let schedule = null;
  try {
    const { orderIds, vehicleId, driverId, departureDate, expectedArrivalDate, location } = req.body;

    // Log the incoming request body for debugging
    console.log('Create Schedule Request Body:', req.body);

    // Validate required fields
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

    // Validate driverId
    const driverExists = simulatedDrivers.some((driver) => driver._id === driverId);
    if (!driverExists) {
      console.log('Validation failed: Invalid driverId:', driverId);
      return res.status(400).json({ error: `Invalid driverId: ${driverId}` });
    }

    // Validate orderIds: Ensure they exist and are in "Confirmed" status
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      params: { status: 'Confirmed', ids: orderIds.join(',') },
    });
    const validOrders = ordersResponse.data;
    console.log('Valid orders for scheduling:', validOrders);

    if (validOrders.length !== orderIds.length) {
      const invalidOrderIds = orderIds.filter(id => !validOrders.some(order => order._id === id));
      console.log('Validation failed: Some orderIds are invalid or not in Confirmed status:', invalidOrderIds);
      return res.status(400).json({ error: `Invalid orderIds or not in Confirmed status: ${invalidOrderIds.join(', ')}` });
    }

    // Generate a unique shipmentId
    const shipmentId = await generateShipmentId();

    // Create the schedule
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

    // Log the created schedule
    console.log('Schedule created successfully:', schedule);

    // Update associated orders to "Shipped" status and add shipmentId (via Order API)
    for (const orderId of orderIds) {
      try {
        console.log(`Updating order ${orderId} to Shipped with shipmentId ${shipmentId}`);
        const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
          status: 'Shipped',
          shipmentId: shipmentId,
        });
        console.log(`Order ${orderId} updated successfully:`, response.data);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error.response?.data || error.message);
        // Rollback: Delete the schedule if any order update fails
        if (schedule) {
          await Schedule.findByIdAndDelete(schedule._id);
          console.log('Rolled back schedule creation due to order update failure:', schedule._id);
        }
        return res.status(500).json({
          error: `Failed to update order ${orderId}: ${error.response?.data?.error || error.message}`,
        });
      }
    }

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error.message);
    // Ensure rollback if an unexpected error occurs
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

    // Fetch order details for each schedule
    const schedulesWithOrders = await Promise.all(
      schedules.map(async (schedule) => {
        try {
          console.log(`Fetching orders for schedule ${schedule.shipmentId} with orderIds:`, schedule.orderIds);
          const orders = [];
          for (const orderId of schedule.orderIds) {
            try {
              const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
              console.log(`Fetched order ${orderId} for schedule ${schedule.shipmentId}:`, response.data);
              if (response.data) {
                orders.push(response.data);
              }
            } catch (error) {
              console.error(`Failed to fetch order ${orderId} for schedule ${schedule.shipmentId}:`, error.response?.data || error.message);
            }
          }
          console.log(`Orders for schedule ${schedule.shipmentId}:`, orders);
          return { ...schedule._doc, orders };
        } catch (error) {
          console.error(`Failed to fetch orders for schedule ${schedule.shipmentId}:`, error.response?.data || error.message);
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

    // If status is "In Progress", move the schedule to Shipment Status Tracking
    if (status === 'In Progress') {
      console.log(`Moving schedule ${id} to Shipment Status with status "In Transit"`);
      const response = await axios.post(`http://localhost:5000/api/schedules/${id}/complete`, {
        expectedArrivalDate: schedule.expectedArrivalDate,
      });
      console.log(`Schedule ${id} moved to Shipment Status:`, response.data);
      return res.status(200).json(response.data);
    }

    // Otherwise, update the schedule status and location
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

    // Sync the updated status and location with associated orders
    const newStatus = status || updatedSchedule.status;
    const newLocation = location || updatedSchedule.location;
    for (const orderId of updatedSchedule.orderIds) {
      try {
        const orderStatus = newStatus === 'Completed' ? 'Delivered' : newStatus === 'Delayed' ? 'Shipped' : 'Shipped';
        console.log(`Updating order ${orderId} to ${orderStatus} with location ${newLocation}`);
        const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
          status: orderStatus,
          location: newLocation,
        });
        console.log(`Order ${orderId} updated successfully:`, response.data);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error.response?.data || error.message);
        return res.status(500).json({ error: `Failed to update order ${orderId}: ${error.response?.data?.error || error.message}` });
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

    // Update associated orders to remove shipmentId and revert status
    for (const orderId of schedule.orderIds) {
      try {
        console.log(`Reverting order ${orderId} to Confirmed status`);
        const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
          status: 'Confirmed',
          shipmentId: null,
        });
        console.log(`Order ${orderId} updated successfully:`, response.data);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error.response?.data || error.message);
        return res.status(500).json({ error: `Failed to update order ${orderId}: ${error.response?.data?.error || error.message}` });
      }
    }

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
    const response = await axios.get('http://localhost:5000/api/orders', {
      params: { status: 'Confirmed' },
    });
    console.log('Ready-to-ship orders fetched:', response.data);
    res.status(200).json(response.data || []);
  } catch (error) {
    console.error('Error fetching ready-to-ship orders:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch ready-to-ship orders: ' + (error.response?.data?.error || error.message) });
  }
};

// Get drivers (simulated for now)
exports.getDrivers = async (req, res) => {
  try {
    res.status(200).json(simulatedDrivers);
  } catch (error) {
    console.error('Error fetching drivers:', error.message);
    res.status(500).json({ error: 'Failed to fetch drivers: ' + error.message });
  }
};