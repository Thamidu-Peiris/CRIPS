// CRIPS\backend\routes\csm\csmCustomerRoutes.js
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

module.exports = router;