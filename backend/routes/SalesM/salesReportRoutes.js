// backend/routes/SalesM/salesReportRoutes.js
const express = require("express");
const router = express.Router();
const salesReportController = require("../../controllers/SalesManager/reportController");
const User = require("../../models/customer/User"); // Path to the User model
const FuelLog = require("../../models/TransportManager/FuelLog");

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

// Endpoint to get the number of new customers in the last 7 days
router.get('/new-customers-last-day', async (req, res) => {
  try {
    console.log("Received request for /new-customers-last-seven-days");
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate()-7); // Calculate the date 7 days ago
    console.log("One day ago:", oneDayAgo);

    console.log("Querying User model for new customers...");
    const newCustomersCount = await User.countDocuments({
      role: "Customers", // Adjust this based on the actual role value in your database
    });
    console.log("New customers count:", newCustomersCount);

    res.status(200).json({ newCustomersCount });
  } catch (error) {
    console.error('Error fetching new customers count:', error);
    res.status(500).json({ error: 'Failed to fetch new customers count', details: error.message });
  }
});

// New endpoint to get the total fuel cost for the last 7 days
router.get('/total-fuel-cost-last-7-days', async (req, res) => {
    try {
      console.log("Received request for /total-fuel-cost-last-7-days");
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Calculate 7 days ago in milliseconds
      console.log("Seven days ago:", sevenDaysAgo);
  
      console.log("Querying FuelLog model for total fuel cost...");
      const fuelLogs = await FuelLog.aggregate([
        {
          $match: {
            date: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            totalCost: { $sum: "$cost" },
          },
        },
      ]);
  
      const totalFuelCost = fuelLogs.length > 0 ? fuelLogs[0].totalCost : 0;
      console.log("Total fuel cost:", totalFuelCost);
  
      res.status(200).json({ totalFuelCost });
    } catch (error) {
      console.error('Error fetching total fuel cost:', error);
      res.status(500).json({ error: 'Failed to fetch total fuel cost', details: error.message });
    }
  });

module.exports = router;