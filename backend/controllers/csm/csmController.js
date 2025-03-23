// CRIPS\backend\controllers\csm\csmController.js
const bcrypt = require("bcryptjs");
const CsmModel = require("../../models/csm/csmModel");
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Fetch Profile by ID
const getProfileById = async (req, res) => {
  try {
    const user = await CsmModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber } = req.body;

    const updatedUser = await CsmModel.findById(req.params.id);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    updatedUser.firstName = firstName || updatedUser.firstName;
    updatedUser.lastName = lastName || updatedUser.lastName;
    updatedUser.address = address || updatedUser.address;
    updatedUser.phoneNumber = phoneNumber || updatedUser.phoneNumber;

    if (req.file) {
      updatedUser.profileImage = `/uploads/${req.file.filename}`;
    }

    await updatedUser.save();

    res.status(200).json({ success: true, message: "Profile updated successfully!", updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await CsmModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

// Save job applications
const applyForJob = async (req, res) => {
  try {
    const { jobTitle, firstName, lastName, username, address, phoneNumber, email, password } = req.body;

    if (!jobTitle || !firstName || !lastName || !username || !address || !phoneNumber || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await CsmModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newApplication = new CsmModel({
      jobTitle,
      firstName,
      lastName,
      username,
      address,
      phoneNumber,
      email,
      password: hashedPassword,
      role: jobTitle,
    });

    await newApplication.save();
    res.status(201).json({ success: true, message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
};

// Employee Login (not used anymore, but keeping for reference)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await CsmModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = {
  getProfileById,
  updateProfile: [upload.single('profileImage'), updateProfile], // Add multer middleware
  changePassword,
  applyForJob,
  login,
};