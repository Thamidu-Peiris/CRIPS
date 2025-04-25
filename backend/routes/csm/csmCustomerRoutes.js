// backend\routes\csm\csmCustomerRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../../models/customer/User');

// Get all pending customers
router.get('/pending', async (req, res) => {
  try {
    const pendingCustomers = await User.find({ status: 'pending' }).select('-password'); // Exclude password from response
    res.json(pendingCustomers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending customers', error });
  }
});

// Get all approved customers
router.get('/approved', async (req, res) => {
  try {
    const approvedCustomers = await User.find({ status: 'approved' }).select('-password');
    res.json(approvedCustomers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved customers', error });
  }
});

// Approve Customer
router.put('/:id/approve', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Customer Approved', user });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed', error });
  }
});

// Decline Customer
router.put('/:id/decline', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Customer Declined', user });
  } catch (error) {
    res.status(500).json({ message: 'Decline failed', error });
  }
});

// Update Customer Details
router.put('/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const updates = req.body;

    // Fields that can be updated
    const allowedUpdates = [
      'firstName',
      'lastName',
      'email',
      'companyName',
      'address',
      'phoneNumber',
      'businessAddress',
      'taxId',
    ];

    // Validate that only allowed fields are updated
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));
    if (!isValidUpdate) {
      return res.status(400).json({ message: 'Invalid updates: only certain fields can be updated' });
    }

    // Check if email is being updated and ensure it's unique
    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email, _id: { $ne: customerId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }

    const customer = await User.findByIdAndUpdate(customerId, updates, { new: true, runValidators: true });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer details updated successfully', customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: 'Failed to update customer details', error: error.message });
  }
});

module.exports = router;