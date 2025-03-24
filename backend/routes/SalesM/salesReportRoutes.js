// backend/routes/SalesM/salesReportRoutes.js
const express = require("express");
const router = express.Router();
const salesReportController = require("../../controllers/SalesManager/reportController");

// Existing routes
router.get("/financial-report", salesReportController.getFinancialReport);
router.get("/customer-report", salesReportController.getCustomerReport);
router.get("/payroll-report", salesReportController.getPayrollReport);
router.get("/product-performance-report", salesReportController.getProductPerformanceReport);
router.get("/dashboard-data", salesReportController.getDashboardData);

// New routes for salary sheet
router.post("/salary-sheet", salesReportController.addSalarySheet);
router.get("/salary-sheet", salesReportController.getSalarySheet);
router.put("/salary-sheet/:id", salesReportController.updateSalarySheetEntry);
router.delete("/salary-sheet/:id", salesReportController.deleteSalarySheetEntry);

module.exports = router;