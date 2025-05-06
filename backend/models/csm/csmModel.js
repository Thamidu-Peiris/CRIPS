// backend\models\csm\csmModel.js
const mongoose = require("mongoose");

const csmModelSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Customer Service Manager", "Grower Handler", "Cutters", "Inventory Manager", "Sales Manager"], required: true },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("csmModel", csmModelSchema);