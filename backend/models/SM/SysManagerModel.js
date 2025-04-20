// backend\models\SM\SysManagerModel.js (System Manager/Admin)
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const systemManagerSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // Added to match JobApplication
  lastName: { type: String, required: true }, // Added to match JobApplication
  username: { type: String, required: true, unique: true }, // Changed to lowercase
  password: { type: String, required: true }, // Changed to lowercase
  contactNo: { type: String, required: true }, // Changed to lowercase, renamed from Contact_No
  dob: { type: Date, required: true }, // Changed to lowercase
  email: { type: String, required: true, unique: true }, // Changed to lowercase
  address: { type: String, required: true }, // Changed to lowercase
  role: { 
    type: String, 
    enum: ["SystemManager"], // Restrict to SystemManager role
    default: "SystemManager" 
  },
  profileImage: { type: String }, // Added to match JobApplication
  createdAt: { type: Date, default: Date.now }, // Added to match JobApplication
});

// Password Hashing Middleware
systemManagerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Changed to lowercase
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Changed to lowercase
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Prevent model overwrite error
module.exports = mongoose.models.SystemManager || mongoose.model("SystemManager", systemManagerSchema);