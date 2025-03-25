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

    // Parse supplies from req.body.supplies (nested array)
    let supplies = [];
    if (req.body.supplies && Array.isArray(req.body.supplies)) {
      supplies = req.body.supplies.map((supply, index) => {
        const photoFile = req.files.find(file => file.fieldname === `supplies[${index}][photo]`);
        if (!photoFile) {
          throw new Error(`Supply photo for item ${index + 1} is required`);
        }

        return {
          itemType: supply.itemType,
          description: supply.description || '',
          quantity: parseInt(supply.quantity, 10),
          unit: supply.unit,
          photo: photoFile.path.replace(/\\/g, "/"), // Ensure correct path format
        };
      });
    }

    // Validate supplies
    if (supplies.length === 0) {
      return res.status(400).json({ success: false, message: "At least one supply item is required" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new supplier
    const newSupplier = new Supplier({
      NIC,
      name,
      companyName,
      username,
      contactNumber,
      email,
      address,
      password: hashedPassword, // ✅ Store hashed password
      supplies, // ✅ Fixed reference
      status: 'pending',
    });

    await newSupplier.save();

    res.status(201).json({ success: true, message: "Supplier registration submitted successfully!" });
  } catch (error) {
    console.error("❌ Supplier registration error:", error);
    res.status(500).json({ success: false, message: error.message });
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