const Vehicle = require('../../models/TransportManager/Vehicle');
const path = require('path');
const fs = require('fs');

// Add a new vehicle
exports.addVehicle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Vehicle picture is required' });
    }
    const vehicleData = {
      ...req.body,
      picture: `/uploads/vehicles/${req.file.filename}`, // Store the file path
    };
    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const vehicleData = { ...req.body };
    if (req.file) {
      // Delete the old picture if it exists
      if (vehicle.picture) {
        const oldPicturePath = path.join(__dirname, '..', '..', vehicle.picture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }
      vehicleData.picture = `/uploads/vehicles/${req.file.filename}`;
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, vehicleData, { new: true, runValidators: true });
    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    // Delete the picture file
    if (vehicle.picture) {
      const picturePath = path.join(__dirname, '..', '..', vehicle.picture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};