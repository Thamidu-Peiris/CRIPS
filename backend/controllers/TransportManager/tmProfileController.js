const TransportManager = require('../../models/TransportManager/TransportManagerModel');

const getProfile = async (req, res) => {
  try {
    const transportManager = await TransportManager.findById(req.user.id).select('-password');
    if (!transportManager) {
      return res.status(404).json({ message: 'Transport Manager not found' });
    }
    res.json(transportManager);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, username, address, phoneNumber, email } = req.body;
    const transportManager = await TransportManager.findById(req.user.id);
    if (!transportManager) {
      return res.status(404).json({ message: 'Transport Manager not found' });
    }
    transportManager.firstName = firstName || transportManager.firstName;
    transportManager.lastName = lastName || transportManager.lastName;
    transportManager.username = username || transportManager.username;
    transportManager.address = address || transportManager.address;
    transportManager.phoneNumber = phoneNumber || transportManager.phoneNumber;
    transportManager.email = email || transportManager.email;
    const updatedProfile = await transportManager.save();
    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile };