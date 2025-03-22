// CRIPS\backend\controllers\SM\authController.js
const SystemManager = require('../models/SM/SysManagerModel');
const User = require('../models/customer/User');
const JobApplication = require('../models/csm/JobApplication');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.universalLogin = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    console.log("Request Body:", req.body);
    let user;
    let role = "";

    // Check System Manager
    console.log("Checking SystemManager...");
    user = await SystemManager.findOne({ $or: [{ Email: emailOrUsername }, { UserName: emailOrUsername }] });
    if (user) {
      console.log("SystemManager found:", user);
      role = "systemmanager"; // Lowercase for consistency
    }

    // Check Customer
    if (!user) {
      console.log("Checking User (Customer)...");
      user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
      if (user) {
        console.log("Customer found:", user);
        role = (user.role || "customer").toLowerCase(); // Lowercase for consistency
      }
    }

    // Check Employee (Customer Service Manager, etc.)
    if (!user) {
      console.log("Checking JobApplication (CSM, etc.)...");
      user = await JobApplication.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
      if (user) {
        console.log("JobApplication found:", user);
        role = user.role.toLowerCase(); // Lowercase for consistency
      }
    }

    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User Password Field:", user?.Password || user?.password);
    const isMatch = await bcrypt.compare(password, user.Password || user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    const userData = {
      id: user._id,
      email: user.Email || user.email,
      username: user.UserName || user.username,
      firstName: user.FirstName || user.firstName || "",
      lastName: user.LastName || user.lastName || "",
      profileImage: user.profileImage || "",
      role,
    };

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: userData,
    });
  } catch (error) {
    console.error("Universal Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};