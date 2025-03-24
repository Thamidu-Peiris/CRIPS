const User = require('../../models/customer/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only JPEG/JPG/PNG images are allowed'));
};

// Pre-configure upload as single-file middleware without size limit
const upload = multer({
  storage,
  fileFilter, // No limits specified
}).single('profileImage');

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const createUser = async (req, res) => {
  const { role, firstName, lastName, username, address, phoneNumber, email, password, companyName, businessAddress, taxId } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      role,
      firstName,
      lastName,
      username,
      address,
      phoneNumber,
      email,
      password: hashedPassword,
      companyName,
      businessAddress,
      taxId,
      profileImage: req.file ? `/uploads/${req.file.filename}` : undefined,
      status: 'pending',
    });

    await newUser.save();
    res.status(201).json({
      message: 'Registration successful. Please wait for approval from the Customer Service Manager.',
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        profileImage: newUser.profileImage,
        role: newUser.role,
        companyName: newUser.companyName,
        businessAddress: newUser.businessAddress,
        taxId: newUser.taxId,
        status: newUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({
        message: `Your account is ${user.status}. Please wait for approval or contact support if declined.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        profileImage: user.profileImage,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { email, firstName, lastName, phoneNumber, address } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;

      if (req.file) {
        user.profileImage = `/uploads/${req.file.filename}`;
      }

      await user.save();

      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          address: user.address,
          profileImage: user.profileImage,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
  });
};

const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};

module.exports = { createUser, loginUser, updateUserProfile, changePassword, deleteUser, upload };