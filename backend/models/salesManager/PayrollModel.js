// backend\models\salesManager\PayrollModel.js
const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  designation: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  month: { type: Number, required: true }, // e.g., 1 for January, 2 for February
  year: { type: Number, required: true }, // e.g., 2025
});

module.exports = mongoose.model("Payroll", payrollSchema);