// backend\controllers\Supplier\supplierController.js
const Supplier = require('../../models/SupplierM/Supplier');
const path = require('path');
const bcrypt = require('bcryptjs'); // ✅ Add bcrypt for password hashing

// ✅ Register Supplier Controller
exports.registerSupplier = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    console.log("Raw req.body keys:", Object.keys(req.body));

    const {
      NIC,
      name,
      companyName,
      username,
      contactNumber,
      email,
      address,
      password,
      termsAccepted,
    } = req.body;

    // Validate required fields
    if (!NIC || !name || !username || !contactNumber || !email || !address || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!termsAccepted || termsAccepted !== 'true') {
      return res.status(400).json({ success: false, message: "Terms and Privacy Policy must be accepted" });
    }

    // Parse supplies from req.files to determine indices (since each supply item must have a photo)
    let supplies = [];
    console.log("All files received:", req.files);
    const supplyIndices = [...new Set(
      req.files
        .filter(file => {
          const matches = file.fieldname.match(/supplies\[\d+\]\[photo\]/);
          console.log(`File fieldname: ${file.fieldname}, Matches regex: ${!!matches}`);
          return matches;
        })
        .map(file => parseInt(file.fieldname.match(/supplies\[(\d+)\]/)[1], 10))
    )];

    if (supplyIndices.length === 0) {
      return res.status(400).json({ success: false, message: "At least one supply item is required" });
    }

    // Parse req.body.supplies if it's a string
    let supplyItems = [];
    if (typeof req.body.supplies === 'string') {
      try {
        supplyItems = JSON.parse(req.body.supplies);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid supplies format: must be a valid JSON array" });
      }
    } else if (Array.isArray(req.body.supplies)) {
      supplyItems = req.body.supplies;
    } else {
      return res.status(400).json({ success: false, message: "Supplies must be an array" });
    }

    for (const index of supplyIndices) {
      // Access supply item from parsed supplyItems array
      const supplyItem = supplyItems && supplyItems[index] ? supplyItems[index] : {};
      const itemType = supplyItem.itemType;
      const description = supplyItem.description || '';
      const quantity = supplyItem.quantity;
      const unit = supplyItem.unit;
      const photoFile = req.files.find(file => file.fieldname === `supplies[${index}][photo]`);

      // Validate required fields for each supply item
      if (!itemType || !quantity || !unit || !photoFile) {
        return res.status(400).json({ 
          success: false, 
          message: `Missing required fields for supply item ${index + 1}: ${!itemType ? 'itemType' : ''} ${!quantity ? 'quantity' : ''} ${!unit ? 'unit' : ''} ${!photoFile ? 'photo' : ''}`
        });
      }

      // Ensure quantity is a valid number
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Quantity for supply item ${index + 1} must be a positive number`
        });
      }

      supplies.push({
        itemType,
        description,
        quantity: parsedQuantity,
        unit,
        photo: photoFile.path.replace(/\\/g, "/"),
      });
    }

    // Validate supplies
    if (supplies.length === 0) {
      return res.status(400).json({ success: false, message: "At least one supply item is required" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new supplier, set supplierId to NIC
    const newSupplier = new Supplier({
      NIC,
      supplierId: NIC, // Set supplierId to the same value as NIC
      name,
      companyName,
      username,
      contactNumber,
      email,
      address,
      password: hashedPassword,
      supplies,
      status: 'pending',
    });

    await newSupplier.save();

    // Return the supplierId (same as NIC) in the response
    res.status(201).json({ 
      success: true, 
      message: "Supplier registration submitted successfully!", 
      supplierId: newSupplier.supplierId 
    });
  } catch (error) {
    console.error("❌ Supplier registration error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({ success: false, message: `${field} already exists` });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ✅ Get Pending Suppliers
exports.getPendingSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ status: 'pending' });
    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Approve / Reject Supplier
exports.updateSupplierStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const supplier = await Supplier.findByIdAndUpdate(id, { status }, { new: true });
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, message: `Supplier ${status}`, supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};