const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const systemManagerSchema = new mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Contact_No: { type: String, required: true },
  DOB: { type: Date, required: true },
  Email: { type: String, required: true, unique: true },
  Address: { type: String, required: true },
  role: { type: String, default: "SystemManager" }
});

// Password Hashing
systemManagerSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Prevent model overwrite error
module.exports = mongoose.models.SystemManager || mongoose.model("SystemManager", systemManagerSchema);
