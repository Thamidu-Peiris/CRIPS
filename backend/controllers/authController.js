// backend/controllers/SM/authController.js
const SystemManager = require("../models/SM/SysManagerModel");
const InventoryManager = require("../models/InventoryM/inventoryManagerModel");
const User = require("../models/customer/User");
const CSM = require("../models/csm/csmModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.universalLogin = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    console.log("Request Body:", req.body);
    let user;
    let role = "";

    // Check System Manager
    console.log("Checking SystemManager...", SystemManager.collection.name);
    user = await SystemManager.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],//
    });
    if (user) {
      console.log("SystemManager found:", user);
      role = "SystemManager"; // Match the database (uppercase)
    }

    // check InventoryManager
    if (!user) {
    console.log("Checking InventoryManager...", InventoryManager.collection.name);
    user = await InventoryManager.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],//
    });

    if (user) {
      console.log("InventoryManager found:", user);
      role = "InventoryManager"; // Match the database (uppercase)
    }}

    // Check Customer
    if (!user) {
      console.log("Checking User (Customer)..." , User.collection.name);
      user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
      if (user) {
        console.log("Customer found:", user);
        role = user.role || "Customer"; // Ensure uppercase for consistency
      }
    }

    // CSM
    if (!user) {
      console.log("Checking CSM..." , CSM.collection.name);
      user = await CSM.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
      if (user) {
        console.log("CSM found:", user);
        role = "Customer Service Manager"; // CSM
      }
    }

    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User Password Field:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "2h" }
    );

    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
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