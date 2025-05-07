// backend\routes\csm\csmCustomerRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../../models/customer/User');
const CustomerOrder = require('../../models/customer/CustomerOrder');
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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        approvedAt: new Date() // Set approvedAt to the current date
      },
      { new: true }
    );
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

router.get('/reviews/pending', async (req, res) => {
  try {
    console.log("Received request for /api/csm/customers/reviews/pending");
    const orders = await CustomerOrder.find({ 'reviews.status': 'pending' })
      .populate('userId', 'firstName lastName')
      .lean();
    console.log("Orders found:", orders.length, "Orders:", orders);
    const pendingReviews = orders
      .flatMap(order =>
        order.reviews
          .filter(review => review.status === 'pending' && order.userId) // Ensure userId is valid
          .map(review => ({
            _id: review._id,
            orderId: order._id,
            user: order.userId, // Will be null if userId is invalid
            rating: review.rating,
            review: review.review,
            createdAt: review.createdAt,
            items: order.items,
          }))
      )
      .filter(review => review.user); // Filter out reviews with null user
    console.log("Pending reviews processed:", pendingReviews);
    if (pendingReviews.length === 0) {
      console.log("No pending reviews found in database.");
    }
    res.json(pendingReviews);
  } catch (error) {
    console.error("Error fetching pending reviews:", error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch pending reviews', error: error.message });
  }
});

router.put('/reviews/:orderId/:reviewId/approve', async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const review = order.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.status = 'approved';
    await order.save();
    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve review', error });
  }
});

router.put('/reviews/:orderId/:reviewId/reject', async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const review = order.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.status = 'rejected';
    await order.save();
    res.json({ message: 'Review rejected', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject review', error });
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

// Add these routes here
router.get('/reviews/pending', async (req, res) => { /* ... */ });
router.put('/reviews/:orderId/:reviewId/approve', async (req, res) => { /* ... */ });
router.put('/reviews/:orderId/:reviewId/reject', async (req, res) => { /* ... */ });

module.exports = router;