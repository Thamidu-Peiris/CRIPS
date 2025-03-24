// backend/controllers/SalesManager/reportController.js
const Transaction = require("../../models/salesManager/FinancialModel");
const Customer = require("../../models/salesManager/CustomerModel");
const Payroll = require("../../models/salesManager/PayrollModel");
const Product = require("../../models/salesManager/ProductModel");

// Financial Report Controller
const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    // Fetch transactions within the date range
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: 1 });

    // Calculate aggregates
    const aggregates = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$income" },
          totalExpense: { $sum: "$expense" },
        },
      },
    ]);

    const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

    res.status(200).json({
      transactions,
      aggregates: {
        totalIncome: aggregates[0]?.totalIncome || 0,
        totalExpense: aggregates[0]?.totalExpense || 0,
        finalBalance,
      },
    });
  } catch (error) {
    console.error("Error fetching financial report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Customer Report Controller
const getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Fetch top customers by total purchases
    let query = {};
    if (startDate && endDate) {
      query.lastPurchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const topCustomers = await Customer.find(query)
      .sort({ totalPurchases: -1 })
      .limit(5);

    // Fetch payment method distribution
    const paymentMethods = await Customer.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate percentages for payment methods
    const total = paymentMethods.reduce((sum, method) => sum + method.count, 0);
    const paymentMethodData = paymentMethods.map((method) => ({
      name: method._id,
      value: total > 0 ? (method.count / total) * 100 : 0,
    }));

    // Fetch summary data (new customers, total purchases)
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const totalPurchases = await Customer.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$totalPurchases" } } },
    ]);

    res.status(200).json({
      topCustomers,
      paymentMethods: paymentMethodData,
      summary: {
        newCustomers,
        totalPurchases: totalPurchases[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching customer report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Payroll Report Controller
const getPayrollReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validate month and year
    if (!month || !year) {
      return res.status(400).json({ error: "month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Fetch payroll data for the specified month
    const payroll = await Payroll.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate total payroll cost
    const totalPayroll = await Payroll.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$netSalary" },
        },
      },
    ]);

    res.status(200).json({
      payroll,
      totalPayroll: totalPayroll[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching payroll report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Product Performance Controller
const getProductPerformanceReport = async (req, res) => {
  try {
    const { category, startDate, endDate, sortBy = "revenue" } = req.query;

    // Build query based on filters
    let query = {};
    if (category) {
      query.category = category;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Fetch products
    const products = await Product.find(query).sort({ [sortBy]: -1 });

    // Calculate aggregates
    const aggregates = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          totalUnitsSold: { $sum: "$unitsSold" },
        },
      },
    ]);

    // Fetch top and least selling products
    const topSelling = await Product.find(query).sort({ unitsSold: -1 }).limit(3);
    const leastSelling = await Product.find(query).sort({ unitsSold: 1 }).limit(3);

    // Calculate sales trend (average units sold per product)
    const salesTrend = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$name",
          value: { $sum: "$unitsSold" },
        },
      },
    ]);

    res.status(200).json({
      products,
      topSelling,
      leastSelling,
      salesTrend: salesTrend.map((item) => ({ name: item._id, value: item.value })),
      aggregates: {
        totalRevenue: aggregates[0]?.totalRevenue || 0,
        totalUnitsSold: aggregates[0]?.totalUnitsSold || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching product performance report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Dashboard Data Controller (for SalesManagerDashboard.js)
const getDashboardData = async (req, res) => {
  try {
    // Fetch revenue data for the bar chart (last 12 months)
    const revenueData = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          revenue: { $sum: "$income" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueChartData = revenueData.map((item) => ({
      month: months[item._id - 1],
      revenue: item.revenue,
    }));

    // Fetch top selling products
    const topSellingPlants = await Product.find()
      .sort({ unitsSold: -1 })
      .limit(5);

    // Fetch recent orders (simulated with customer purchases)
    const recentOrders = await Customer.find()
      .sort({ lastPurchaseDate: -1 })
      .limit(5)
      .select("name totalPurchases lastPurchaseDate");

    // Fetch summary data (last 7 days sales, last month revenue)
    const last7Days = new Date(new Date().setDate(new Date().getDate() - 7));
    const lastMonthStart = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const lastMonthEnd = new Date();

    const salesLast7Days = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$unitsSold" },
        },
      },
    ]);

    const revenueLastMonth = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$income" },
        },
      },
    ]);

    res.status(200).json({
      revenueChartData,
      topSellingPlants,
      recentOrders: recentOrders.map((order) => ({
        id: order._id,
        customer: order.name,
        amount: order.totalPurchases,
        status: "Complete", // Placeholder status
      })),
      summary: {
        salesLast7Days: salesLast7Days[0]?.totalUnits || 0,
        revenueLastMonth: revenueLastMonth[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new salary sheet entry
const addSalarySheet = async (req, res) => {
  try {
    const { entries, month, year } = req.body;

    // Validate input
    if (!entries || !Array.isArray(entries) || !month || !year) {
      return res.status(400).json({ error: "Entries, month, and year are required" });
    }

    // Add month and year to each entry and save to database
    const payrollEntries = entries.map((entry) => ({
      ...entry,
      month: Number(month),
      year: Number(year),
    }));

    const savedEntries = await Payroll.insertMany(payrollEntries);
    res.status(201).json({ message: "Salary sheet created successfully", entries: savedEntries });
  } catch (error) {
    console.error("Error adding salary sheet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch salary sheet for a specific month and year
const getSalarySheet = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const payrollEntries = await Payroll.find({
      month: Number(month),
      year: Number(year),
    }).sort({ employeeName: 1 });

    res.status(200).json(payrollEntries);
  } catch (error) {
    console.error("Error fetching salary sheet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// New: Update a salary sheet entry
const updateSalarySheetEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName, designation, basicSalary, allowances, deductions, netSalary } = req.body;

    // Validate input
    if (!employeeName || !designation || !basicSalary || !netSalary) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Find and update the entry
    const updatedEntry = await Payroll.findByIdAndUpdate(
      id,
      {
        employeeName,
        designation,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        netSalary: Number(netSalary),
      },
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Salary sheet entry not found" });
    }

    console.log("Updated entry:", updatedEntry);
    res.status(200).json({ message: "Salary sheet entry updated successfully", entry: updatedEntry });
  } catch (error) {
    console.error("Error updating salary sheet entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// New: Delete a salary sheet entry
const deleteSalarySheetEntry = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the entry
    const deletedEntry = await Payroll.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: "Salary sheet entry not found" });
    }

    console.log("Deleted entry:", deletedEntry);
    res.status(200).json({ message: "Salary sheet entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting salary sheet entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getFinancialReport,
  getCustomerReport,
  getPayrollReport,
  getProductPerformanceReport,
  getDashboardData,
  addSalarySheet,
  getSalarySheet,
  updateSalarySheetEntry,
  deleteSalarySheetEntry,
};