const Driver = require('../../models/TransportManager/drivers');
const path = require('path');
const fs = require('fs');
const Shipment = require('../../models/TransportManager/Shipment');

// Helper function to generate a unique driverId
const generateDriverId = async () => {
  const prefix = 'DRV';
  const latestDriver = await Driver.findOne().sort({ createdAt: -1 });
  let newIdNumber = 1;
  if (latestDriver && latestDriver.driverId) {
    const number = parseInt(latestDriver.driverId.replace(prefix, '')) || 0;
    newIdNumber = number + 1;
  }
  return `${prefix}${String(newIdNumber).padStart(3, '0')}`; // e.g., "DRV001"
};

// Create a new driver
exports.createDriver = async (req, res) => {
  try {
    const { name, email, phoneNumber, licenseNumber, status } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !licenseNumber) {
      return res.status(400).json({ error: 'Name, email, phone number, and license number are required' });
    }

    // Generate a unique driverId
    const driverId = await generateDriverId();

    // Create the driver
    const driverData = {
      driverId,
      name,
      email,
      phoneNumber,
      licenseNumber,
      status: status || 'Available',
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const driver = await Driver.create(driverData);
    console.log('Driver created:', driver);
    res.status(201).json(driver);
  } catch (error) {
    console.error('Error creating driver:', error.message);
    res.status(500).json({ error: 'Failed to create driver: ' + error.message });
  }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    const driversWithShipments = await Promise.all(
      drivers.map(async (driver) => {
        const shipments = await Shipment.find({ driverId: driver.driverId, status: { $in: ['In Transit', 'Delayed'] } });
        return { ...driver._doc, assignedShipments: shipments };
      })
    );
    res.status(200).json(driversWithShipments);
  } catch (error) {
    console.error('Error fetching drivers:', error.message);
    res.status(500).json({ error: 'Failed to fetch drivers: ' + error.message });
  }
};

// Get a single driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      console.log('Driver not found:', req.params.id);
      return res.status(404).json({ error: 'Driver not found' });
    }
    const shipments = await Shipment.find({ driverId: driver.driverId, status: { $in: ['In Transit', 'Delayed'] } });
    res.status(200).json({ ...driver._doc, assignedShipments: shipments });
  } catch (error) {
    console.error('Error fetching driver:', error.message);
    res.status(500).json({ error: 'Failed to fetch driver: ' + error.message });
  }
};

// Update a driver
exports.updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, licenseNumber, status } = req.body;

    const driver = await Driver.findById(id);
    if (!driver) {
      console.log('Driver not found:', id);
      return res.status(404).json({ error: 'Driver not found' });
    }

    // If a new profile picture is uploaded, delete the old one
    if (req.file && driver.profilePicture) {
      const oldImagePath = path.join(__dirname, '..', '..', driver.profilePicture);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Failed to delete old profile picture:', err);
      });
    }

    const updateData = {
      name: name || driver.name,
      email: email || driver.email,
      phoneNumber: phoneNumber || driver.phoneNumber,
      licenseNumber: licenseNumber || driver.licenseNumber,
      status: status || driver.status,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : driver.profilePicture,
    };

    const updatedDriver = await Driver.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Driver updated:', updatedDriver);
    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error('Error updating driver:', error.message);
    res.status(500).json({ error: 'Failed to update driver: ' + error.message });
  }
};

// Delete a driver
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      console.log('Driver not found:', req.params.id);
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Delete the profile picture if it exists
    if (driver.profilePicture) {
      const imagePath = path.join(__dirname, '..', '..', driver.profilePicture);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete profile picture:', err);
      });
    }

    console.log('Driver deleted:', driver);
    res.status(200).json({ message: 'Driver deleted' });
  } catch (error) {
    console.error('Error deleting driver:', error.message);
    res.status(500).json({ error: 'Failed to delete driver: ' + error.message });
  }
};