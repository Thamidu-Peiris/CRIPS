const User = require('../../models/customer/User');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'Customers' }); // Assuming customers have role 'customer'
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'Customers') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'Customers') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const updatedCustomer = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error updating customer', error });
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'Customers') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};