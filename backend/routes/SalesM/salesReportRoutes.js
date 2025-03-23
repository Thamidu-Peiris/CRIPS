// backend/routes/salesReportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../../controllers/SalesManager/reportController");

// Routes for sales reports
router.get("/financial-report", reportController.getFinancialReport);
router.get("/customer-report", reportController.getCustomerReport);
router.get("/payroll-report", reportController.getPayrollReport);
router.get("/product-performance-report", reportController.getProductPerformanceReport);
router.get("/dashboard-data", reportController.getDashboardData);

module.exports = router;