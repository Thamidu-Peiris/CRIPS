const SystemManager = require('../models/SM/SysManagerModel');
const User = require('../models/customer/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.universalLogin = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    console.log("Request Body:", req.body);
    let user;
    let role = "";

    // Check System Manager
    user = await SystemManager.findOne({ $or: [{ Email: emailOrUsername }, { UserName: emailOrUsername }] });
    if (user) role = "SystemManager";

    // Check Customer
    if (!user) {
      user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
      if (user) role = user.role;
    }

    // Optionally Check Employee
    if (!user && Employee) {
      user = await Employee.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
      if (user) role = user.role;
    }

    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User Password Field:", user?.Password || user?.password);
    const isMatch = await bcrypt.compare(password, user.Password || user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        email: user.Email || user.email,
        username: user.UserName || user.username,
        role,
      }
    });
  } catch (error) {
    console.error("Universal Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
