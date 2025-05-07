// backend\controllers\SalesManager\reportController.js
/* eslint-disable */
const Transaction = require("../../models/salesManager/FinancialModel");
const Customer = require("../../models/salesManager/CustomerModel");
const Payroll = require("../../models/salesManager/PayrollModel");
const Product = require("../../models/salesManager/ProductModel");
const CustomerOrder = require("../../models/customer/CustomerOrder");

// Financial Report Controller
const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: "startDate and endDate must be valid dates" });
    }

    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: 1 });

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
    console.error("Error fetching financial report:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Customer Report Controller
const getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate && endDate) {
      if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        return res.status(400).json({ error: "startDate and endDate must be valid dates" });
      }
      query.lastPurchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const topCustomers = await Customer.find(query)
      .sort({ totalPurchases: -1 })
      .limit(5);

    const paymentMethods = await Customer.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = paymentMethods.reduce((sum, method) => sum + method.count, 0);
    const paymentMethodData = paymentMethods.map((method) => ({
      name: method._id,
      value: total > 0 ? (method.count / total) * 100 : 0,
    }));

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
    console.error("Error fetching customer report:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Payroll Report Controller
const getPayrollReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "month and year are required" });
    }

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (isNaN(parsedMonth) || isNaN(parsedYear) || parsedMonth < 1 || parsedMonth > 12 || parsedYear < 1900 || parsedYear > 2100) {
      return res.status(400).json({ error: "month must be between 1 and 12, and year must be a valid year" });
    }

    const payroll = await Payroll.find({
      month: parsedMonth,
      year: parsedYear,
    }).sort({ employeeName: 1 });

    const totalPayroll = await Payroll.aggregate([
      {
        $match: {
          month: parsedMonth,
          year: parsedYear,
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
    console.error("Error fetching payroll report:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Product Performance Controller
const getProductPerformanceReport = async (req, res) => {
  try {
    const { category, startDate: queryStartDate, endDate: queryEndDate, sortBy = "revenue" } = req.query;

    // Set default date range to last 30 days if not provided
    const endDate = queryEndDate || new Date().toISOString().split("T")[0];
    const startDate = queryStartDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: "startDate and endDate must be valid dates" });
    }

    let query = {};
    if (category) {
      query.category = category;
    }
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };

    const products = await Product.find(query).sort({ [sortBy]: -1 });

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

    const topSelling = await Product.find(query).sort({ unitsSold: -1 }).limit(3);
    const leastSelling = await Product.find(query).sort({ unitsSold: 1 }).limit(3);

    const salesTrend = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$name",
          value: { $sum: "$unitsSold" },
        },
      },
    ]);
    const formattedSalesTrend = salesTrend.map((item) => ({ name: item._id, value: item.value }));

    res.status(200).json({
      products,
      topSelling,
      leastSelling,
      salesTrend: formattedSalesTrend,
      aggregates: {
        totalRevenue: aggregates[0]?.totalRevenue || 0,
        totalUnitsSold: aggregates[0]?.totalUnitsSold || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching product performance report:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Dashboard Data Controller (for SalesManagerDashboard.js)
const getDashboardData = async (req, res) => {
  try {
    const { startDate: queryStartDate, endDate: queryEndDate } = req.query;

    // Validate query parameters
    const endDate = queryEndDate || new Date().toISOString().split("T")[0];
    const startDate = queryStartDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: "startDate and endDate must be valid dates" });
    }

    // Parse dates in UTC
    const parsedStartDate = new Date(startDate + "T00:00:00Z");
    const parsedEndDate = new Date(endDate + "T23:59:59.999Z");

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const responseData = {
      revenueData: [],
      topSellingPlants: [],
      recentOrders: [],
      orderStatusDistribution: [],
      topPlantsUnits: [],
      summary: {
        last7DaysUnits: 0,
        lastMonthRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        pendingOrders: 0,
        revenueGrowth: 0,
      },
    };

    // Fetch recent orders from CustomerOrder
    const recentOrders = await CustomerOrder.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("userId", "firstName lastName");
    responseData.recentOrders = recentOrders.map((order) => ({
      id: order._id,
      customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : "Unknown",
      amount: order.total || 0,
      status: order.status || "Unknown",
    }));

    // Last 7 days units
    const salesLast7Days = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $unwind: "$items" },
      { $group: { _id: null, totalUnits: { $sum: "$items.quantity" } } },
    ]);
    responseData.summary.last7DaysUnits = salesLast7Days[0]?.totalUnits || 0;

    // Last 30 days revenue
    const revenueLastMonth = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "Completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    responseData.summary.lastMonthRevenue = revenueLastMonth[0]?.totalRevenue || 0;

    // Total orders (last 30 days)
    const totalOrders = await CustomerOrder.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: "Completed",
    });
    responseData.summary.totalOrders = totalOrders;

    // Average order value (last 30 days)
    const avgOrderValue = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "Completed" } },
      { $group: { _id: null, avgValue: { $avg: "$total" } } },
    ]);
    responseData.summary.avgOrderValue = avgOrderValue[0]?.avgValue || 0;

    // Pending orders (last 30 days)
    const pendingOrders = await CustomerOrder.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: "Pending",
    });
    responseData.summary.pendingOrders = pendingOrders;

    // Revenue growth (last 30 days vs previous 30 days)
    const prevRevenue = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: "Completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const prevRevenueValue = prevRevenue[0]?.totalRevenue || 0;
    const currentRevenue = responseData.summary.lastMonthRevenue;
    responseData.summary.revenueGrowth = prevRevenueValue > 0
      ? ((currentRevenue - prevRevenueValue) / prevRevenueValue) * 100
      : currentRevenue > 0 ? 100 : 0;

    // Order status distribution (last 30 days) for Pie Chart
    const orderStatusDistribution = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } },
    ]);
    responseData.orderStatusDistribution = orderStatusDistribution;

    // Units sold by top plants for Bar Chart
    const salesData = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }, status: "Completed" } },
      { $unwind: "$items" },
      { $group: { _id: "$items.plantName", unitsSold: { $sum: "$items.quantity" } } },
    ]);

    const topPlantsUnits = [];
    for (const sale of salesData) {
      const product = await Product.findOne({ name: { $regex: `^${sale._id}$`, $options: 'i' } }); // Case-insensitive match
      const price = product ? product.price : 0;
      topPlantsUnits.push({
        name: sale._id,
        unitsSold: sale.unitsSold,
        totalRevenue: sale.unitsSold * price,
      });
    }
    responseData.topPlantsUnits = topPlantsUnits.sort((a, b) => b.unitsSold - a.unitsSold);

    // Revenue data for the bar chart (last 12 months)
    const revenueData = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id", 1] },
            ],
          },
          revenue: 1,
          _id: 0,
        },
      },
    ]);
    responseData.revenueData = revenueData;

    // Fetch top-selling plants
    const topSellingPlants = await Product.find()
      .sort({ unitsSold: -1 })
      .limit(3)
      .select("_id name image unitsSold");
    responseData.topSellingPlants = topSellingPlants.map((plant) => ({
      id: plant._id,
      name: plant.name,
      sold: plant.unitsSold,
      image: plant.image || "/default-plant.jpg",
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Add a new salary sheet entry
const addSalarySheet = async (req, res) => {
  try {
    const { entries, month, year } = req.body;

    if (!entries || !Array.isArray(entries) || !month || !year) {
      return res.status(400).json({ error: "Entries, month, and year are required" });
    }

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (isNaN(parsedMonth) || isNaN(parsedYear) || parsedMonth < 1 || parsedMonth > 12 || parsedYear < 1900 || parsedYear > 2100) {
      return res.status(400).json({ error: "month must be between 1 and 12, and year must be a valid year" });
    }

    const payrollEntries = entries.map((entry) => ({
      ...entry,
      month: parsedMonth,
      year: parsedYear,
    }));

    const savedEntries = await Payroll.insertMany(payrollEntries);
    res.status(201).json({ message: "Salary sheet created successfully", entries: savedEntries });
  } catch (error) {
    console.error("Error adding salary sheet:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Fetch salary sheet for a specific month and year
const getSalarySheet = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (isNaN(parsedMonth) || isNaN(parsedYear) || parsedMonth < 1 || parsedMonth > 12 || parsedYear < 1900 || parsedYear > 2100) {
      return res.status(400).json({ error: "month must be between 1 and 12, and year must be a valid year" });
    }

    const payrollEntries = await Payroll.find({
      month: parsedMonth,
      year: parsedYear,
    }).sort({ employeeName: 1 });

    res.status(200).json(payrollEntries);
  } catch (error) {
    console.error("Error fetching salary sheet:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Update a salary sheet entry
const updateSalarySheetEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName, designation, basicSalary, allowances, deductions, netSalary } = req.body;

    if (!employeeName || !designation || !basicSalary || !netSalary) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const parsedBasicSalary = Number(basicSalary);
    const parsedAllowances = Number(allowances) || 0;
    const parsedDeductions = Number(deductions) || 0;
    const parsedNetSalary = Number(netSalary);

    if (isNaN(parsedBasicSalary) || isNaN(parsedAllowances) || isNaN(parsedDeductions) || isNaN(parsedNetSalary)) {
      return res.status(400).json({ error: "Salary fields must be valid numbers" });
    }

    const updatedEntry = await Payroll.findByIdAndUpdate(
      id,
      {
        employeeName,
        designation,
        basicSalary: parsedBasicSalary,
        allowances: parsedAllowances,
        deductions: parsedDeductions,
        netSalary: parsedNetSalary,
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Salary sheet entry not found" });
    }

    res.status(200).json({ message: "Salary sheet entry updated successfully", entry: updatedEntry });
  } catch (error) {
    console.error("Error updating salary sheet entry:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Delete a salary sheet entry
const deleteSalarySheetEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEntry = await Payroll.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: "Salary sheet entry not found" });
    }

    res.status(200).json({ message: "Salary sheet entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting salary sheet entry:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
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