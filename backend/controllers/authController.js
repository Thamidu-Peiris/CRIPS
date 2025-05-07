// backend\controllers\authController.js
const SystemManager = require("../models/SM/SysManagerModel");
const InventoryManager = require("../models/InventoryM/inventoryManagerModel");
const User = require("../models/customer/User");
const CSM = require("../models/csm/csmModel");
const salseManager = require("../models/salesManager/salesManagerModel")
const GrowerHandler = require("../models/GrowerHandler/growerHandlerModel");
const TransportManager = require("../models/TransportManager/TransportManagerModel");
const Cutter = require("../models/cutters/cuttersModel");
const Supplier = require("../models/SupplierM/Supplier");
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

    // check TransportManager
    if (!user) {
      console.log("Checking TransportManager...", TransportManager.collection.name);
      user = await TransportManager.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],//
      });
  
      if (user) {
        console.log("TransportManager found:", user);
        role = "TransportManager"; // Match the database (uppercase)
      }}

      // check supplier
    if (!user) {
      console.log("Checking supplier...", Supplier.collection.name);
      user = await Supplier.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],//
      });
  
      if (user) {
        console.log("Supplier found:", user);
        role = "supplier"; // Match the database (uppercase)
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

    // supplier
    if (!user) {
      console.log("Checking supplier..." , CSM.collection.name);
      user = await CSM.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
      if (user) {
        console.log("CSM found:", user);
        role = "Customer Service Manager"; // CSM
      }
    }


     // salseManager-check
    if (!user) {
      console.log("check salseManager...", salseManager.collection.name);
      user = await salseManager.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],//
      });
  
      if (user) {
        console.log("salseManager found:", user);
        role = "Sales Manager"; // Match the database (uppercase)
      }}

      // cutter-check
    if (!user) {
      console.log("check cutter...", Cutter.collection.name);
      user = await Cutter.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
  
      if (user) {
        console.log("Cutters found:", user);
        role = "Cutters"; // Match the database (uppercase)
      }}

    // check Grower Handler
    if (!user) {
      console.log("Checking Grower Handler...", GrowerHandler.collection.name);
      user = await GrowerHandler.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],//
      });
  
      if (user) {
        console.log("GrowerHandler found:", user);
        role = "Grower Handler"; // Match the database (uppercase)
      }}


    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User Password Field:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Add status check for Customers and Wholesale Dealers (T)
    if (user && (role === "Customers" || role === "Wholesale Dealers")) {
      const userStatus = (user.status || "pending").toLowerCase();
      if (userStatus !== "approved") {
        return res.status(403).json({
          message: `Your account is ${userStatus}. Please wait for approval or contact support if declined.`,
        });
      }
    }

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
      status: user.status || "pending" // Include status in response for frontend(T)
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