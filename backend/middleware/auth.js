const jwt = require("jsonwebtoken");
const SystemManager = require("../models/SM/SysManagerModel");
const InventoryManager = require("../models/InventoryM/inventoryManagerModel");
const User = require("../models/customer/User");
const CSM = require("../models/csm/csmModel");
const SalesManager = require("../models/salesManager/salesManagerModel");
const GrowerHandler = require("../models/GrowerHandler/growerHandlerModel");
const TransportManager = require("../models/TransportManager/TransportManagerModel");
const Cutter = require("../models/cutters/cuttersModel");
const Supplier = require("../models/SupplierM/Supplier");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Auth Middleware - Token:", token);
  if (!token) {
    console.log("Auth Middleware - No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    console.log("Auth Middleware - Decoded Token:", decoded);

    let user;
    // Check based on role
    switch (decoded.role) {
      case "SystemManager":
        user = await SystemManager.findById(decoded.id);
        break;
      case "InventoryManager":
        user = await InventoryManager.findById(decoded.id);
        break;
      case "TransportManager":
        user = await TransportManager.findById(decoded.id);
        break;
      case "supplier":
        user = await Supplier.findById(decoded.id);
        break;
      case "Customers":
      case "Wholesale Dealers":
        user = await User.findById(decoded.id);
        break;
      case "Customer Service Manager":
        user = await CSM.findById(decoded.id);
        break;
      case "Sales Manager":
        user = await SalesManager.findById(decoded.id);
        break;
      case "Grower Handler":
        user = await GrowerHandler.findById(decoded.id);
        break;
      case "Cutters":
        user = await Cutter.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ message: "Invalid role" });
    }

    if (!user) {
      console.log("Auth Middleware - User not found for token");
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Auth Middleware - User from database:", {
      id: user._id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      profileImage: user.profileImage,
    });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware - Invalid token:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;