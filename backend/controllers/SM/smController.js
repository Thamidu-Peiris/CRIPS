// backend\controllers\SM\smController.js
const SystemManager = require("../../models/SM/SysManagerModel");
const GrowerHandler = require("../../models/GrowerHandler/growerHandlerModel");
const Cutter = require("../../models/cutters/cuttersModel");
const SalesManager = require("../../models/salesManager/salesManagerModel");
const InventoryManager = require("../../models/InventoryM/inventoryManagerModel");
const CustomerServiceManager = require("../../models/csm/csmModel");

const bcrypt = require("bcryptjs");

// Role-to-Model mapping
// CRIPS\backend\controllers\SM\smController.js
const roleToModel = {
    "System Manager": SystemManager,
    "Grower Handlers": GrowerHandler,
    "Cutters": Cutter,
    "Sales Manager": SalesManager,
    "Inventory Manager": InventoryManager,
    "Customer Service Manager": CustomerServiceManager,
  };

// CRIPS\backend\controllers\SM\smController.js
const normalizeEmployeeData = (emp, role) => {
    console.log("Normalizing employee:", emp, "with role:", role);
    return {
      _id: emp._id,
      firstName: emp.firstName || emp.UserName || "N/A",
      lastName: emp.lastName || "N/A",
      email: emp.email || emp.Email || "N/A",
      contactNo: emp.phoneNumber || emp.contactNo || emp.Contact_No || "",
      dob: emp.dob || emp.DOB ? (emp.dob || emp.DOB).toISOString().split("T")[0] : "N/A",
      address: emp.address || emp.Address || "N/A",
      role: role,
    };
  };

// Register a new System Manager
const registerSystemManager = async (req, res) => {
  const { firstName, lastName, username, password, contactNo, dob, email, address } = req.body;

  try {
    const existingManager = await SystemManager.findOne({ $or: [{ username }, { email }] });
    if (existingManager) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const systemManager = new SystemManager({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      contactNo,
      dob,
      email,
      address,
    });
    await systemManager.save();
    res.status(201).json({ message: "System Manager registered successfully" });
  } catch (error) {
    console.error("Error registering System Manager:", error);
    res.status(500).json({ message: "Failed to register system manager", error: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile called in smController.js");
    const userId = req.user.id;
    console.log("User ID:", userId);
    const { firstName, lastName, username, email, contactNo, dob, address } = req.body;
    console.log("Received update data:", { firstName, lastName, username, email, contactNo, dob, address });

    const updatedAdmin = await SystemManager.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        email,
        contactNo,
        dob,
        address,
      },
      { new: true, runValidators: true }
    ).select("-password -createdAt -__v");

    if (!updatedAdmin) {
      console.log("System Manager not found for userId:", userId);
      return res.status(404).json({ success: false, message: "System Manager not found" });
    }

    console.log("Updated admin:", updatedAdmin);

    const updatedProfile = {
      firstName: updatedAdmin.firstName,
      lastName: updatedAdmin.lastName,
      username: updatedAdmin.username,
      email: updatedAdmin.email,
      contactNo: updatedAdmin.contactNo,
      dob: updatedAdmin.dob ? updatedAdmin.dob.toISOString().split("T")[0] : "",
      address: updatedAdmin.address,
    };

    res.json({
      message: "Profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    console.log("getProfile called in smProfileController.js");
    const userId = req.user.id;
    console.log("Fetching profile for userId:", userId);
    const admin = await SystemManager.findById(userId).select("-password -createdAt -__v");
    if (!admin) {
      return res.status(404).json({ success: false, message: "System Manager not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch all employees from all collections with optional role filter
const getAllEmployees = async (req, res) => {
    try {
      const { role } = req.query; // Get role from query parameter (e.g., ?role=Grower%20Handlers)
      const employees = [];
  
      if (role && roleToModel[role]) {
        // Fetch employees for the specified role only
        const Model = roleToModel[role];
        const roleEmployees = await Model.find();
        const formattedEmployees = roleEmployees.map((emp) => normalizeEmployeeData(emp, role));
        employees.push(...formattedEmployees);
      } else {
        // Fetch all employees if no role is specified
        for (const [role, Model] of Object.entries(roleToModel)) {
          const roleEmployees = await Model.find();
          const formattedEmployees = roleEmployees.map((emp) => normalizeEmployeeData(emp, role));
          employees.push(...formattedEmployees);
        }
      }
  
      res.json({ success: true, data: employees });
    } catch (error) {
      console.error("Error fetching all employees:", error);
      res.status(500).json({ success: false, message: "Error fetching employees", error: error.message });
    }
  };

// Fetch a specific employee by ID and role
const getEmployeeById = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (!role || !roleToModel[role]) {
      return res.status(400).json({ success: false, message: "Invalid or missing role" });
    }

    const Model = roleToModel[role];
    const employee = await Model.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, data: normalizeEmployeeData(employee, role) });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ success: false, message: "Error fetching employee", error: error.message });
  }
};

// Update an employee by ID and role
const updateEmployee = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (!role || !roleToModel[role]) {
      return res.status(400).json({ success: false, message: "Invalid or missing role" });
    }

    const Model = roleToModel[role];
    const updateData = { ...req.body };
    if (role === "Inventory Manager") {
      updateData.phoneNumber = req.body.contactNo;
      delete updateData.contactNo;
    }

    const employee = await Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, data: normalizeEmployeeData(employee, role) });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(400).json({ success: false, message: "Error updating employee", error: error.message });
  }
};

// Delete an employee by ID and role
const deleteEmployee = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (!role || !roleToModel[role]) {
      return res.status(400).json({ success: false, message: "Invalid or missing role" });
    }

    const Model = roleToModel[role];
    const employee = await Model.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ success: false, message: "Error deleting employee", error: error.message });
  }
};



module.exports = {
  registerSystemManager,
  updateProfile,
  getProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};