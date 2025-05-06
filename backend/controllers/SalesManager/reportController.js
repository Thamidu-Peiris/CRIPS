
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

    const payroll = await Payroll.find({
      month: Number(month),
      year: Number(year),
    }).sort({ employeeName: 1 });

    const totalPayroll = await Payroll.aggregate([
      {
        $match: {
          month: Number(month),
          year: Number(year),
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
    const { category, startDate, endDate, sortBy = "revenue" } = req.query;

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
    console.error("Error fetching product performance report:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Dashboard Data Controller (for SalesManagerDashboard.js)
const getDashboardData = async (req, res) => {
  try {
    console.log("Fetching dashboard data...");

    // Initialize default response
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
    console.log("Fetching recent CustomerOrders...");
    const recentOrders = await CustomerOrder.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "firstName lastName")
      .catch((err) => {
        console.error("CustomerOrder query error:", err.message);
        return [];
      });
    responseData.recentOrders = recentOrders.map((order) => ({
      id: order._id,
      customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : "Unknown",
      amount: order.total || 0,
      status: order.status || "Unknown",
    }));
    console.log("Recent orders:", responseData.recentOrders);

    // Fetch summary data
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    // Last 7 days units
    console.log("Aggregating last 7 days units...");
    const salesLast7Days = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$items.quantity" },
        },
      },
    ]).catch((err) => {
      console.error("Sales last 7 days aggregation error:", err.message);
      return [{ totalUnits: 0 }];
    });
    responseData.summary.last7DaysUnits = salesLast7Days[0]?.totalUnits || 0;
    console.log("Sales last 7 days:", responseData.summary.last7DaysUnits);

    // Last 30 days revenue
    console.log("Aggregating last month revenue from CustomerOrder...");
    const revenueOrders = await CustomerOrder.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: "Completed",
    }).select('_id total createdAt status');
    console.log("Found orders for lastMonthRevenue:", revenueOrders.length, revenueOrders);

    const revenueLastMonth = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]).catch((err) => {
      console.error("CustomerOrder revenue aggregation error:", err.message);
      return [{ totalRevenue: 0 }];
    });
    responseData.summary.lastMonthRevenue = revenueLastMonth[0]?.totalRevenue || 0;
    console.log("Revenue last month:", responseData.summary.lastMonthRevenue);

    // Total orders (last 30 days)
    console.log("Aggregating total orders (last 30 days)...");
    const totalOrders = await CustomerOrder.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: "Completed",
    }).catch((err) => {
      console.error("Total orders query error:", err.message);
      return 0;
    });
    responseData.summary.totalOrders = totalOrders;
    console.log("Total orders (last 30 days):", totalOrders);

    // Average order value (last 30 days)
    console.log("Aggregating average order value (last 30 days)...");
    const avgOrderValue = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          avgValue: { $avg: "$total" },
        },
      },
    ]).catch((err) => {
      console.error("Average order value aggregation error:", err.message);
      return [{ avgValue: 0 }];
    });
    responseData.summary.avgOrderValue = avgOrderValue[0]?.avgValue || 0;
    console.log("Average order value (last 30 days):", responseData.summary.avgOrderValue);

    // Pending orders (last 30 days)
    console.log("Aggregating pending orders (last 30 days)...");
    const pendingOrders = await CustomerOrder.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: "Pending",
    }).catch((err) => {
      console.error("Pending orders query error:", err.message);
      return 0;
    });
    responseData.summary.pendingOrders = pendingOrders;
    console.log("Pending orders (last 30 days):", pendingOrders);

    // Revenue growth (last 30 days vs previous 30 days)
    console.log("Aggregating revenue for previous 30 days...");
    const prevRevenue = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]).catch((err) => {
      console.error("Previous revenue aggregation error:", err.message);
      return [{ totalRevenue: 0 }];
    });
    const prevRevenueValue = prevRevenue[0]?.totalRevenue || 0;
    const currentRevenue = responseData.summary.lastMonthRevenue;
    responseData.summary.revenueGrowth = prevRevenueValue > 0
      ? ((currentRevenue - prevRevenueValue) / prevRevenueValue) * 100
      : currentRevenue > 0 ? 100 : 0;
    console.log("Previous revenue:", prevRevenueValue, "Current revenue:", currentRevenue, "Revenue growth (%):", responseData.summary.revenueGrowth);

    // Order status distribution (last 30 days) for Pie Chart
    console.log("Aggregating order status distribution (last 30 days)...");
    const orderStatusDistribution = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          _id: 0,
        },
      },
    ]).catch((err) => {
      console.error("Order status distribution aggregation error:", err.message);
      return [];
    });
    responseData.orderStatusDistribution = orderStatusDistribution;
    console.log("Order status distribution:", orderStatusDistribution);

    // Units sold by top plants (last 30 days) for Bar Chart
    console.log("Aggregating units sold by top plants (last 30 days)...");
    const topPlantsUnits = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: "Completed",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.plantName",
          unitsSold: { $sum: "$items.quantity" },
        },
      },
      {
        $sort: { unitsSold: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: "$_id",
          unitsSold: 1,
          _id: 0,
        },
      },
    ]).catch((err) => {
      console.error("Top plants units aggregation error:", err.message);
      return [];
    });
    responseData.topPlantsUnits = topPlantsUnits;
    console.log("Top plants units:", topPlantsUnits);

    // Revenue data for the bar chart (last 12 months)
    console.log("Aggregating CustomerOrder data for revenue chart...");
    const ordersForChart = await CustomerOrder.find({
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
      },
      status: "Completed",
    }).select('_id total createdAt status');
    console.log("Found orders for revenueData:", ordersForChart.length, ordersForChart);

    const revenueData = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
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
    ]).catch((err) => {
      console.error("CustomerOrder chart aggregation error:", err.message);
      return [];
    });
    responseData.revenueData = revenueData;
    console.log("Revenue data:", revenueData);

    // Fetch top-selling plants
    console.log("Fetching top-selling Products...");
    const topSellingPlants = await Product.find()
      .sort({ unitsSold: -1 })
      .limit(3)
      .select("_id name image unitsSold")
      .catch((err) => {
        console.error("Product query error:", err.message);
        return [];
      });
    responseData.topSellingPlants = topSellingPlants.map((plant) => ({
      id: plant._id,
      name: plant.name,
      sold: plant.unitsSold,
      image: plant.image || "/default-plant.jpg",
    }));
    console.log("Top-selling plants:", responseData.topSellingPlants);

    console.log("Sending response:", responseData);
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

    const payrollEntries = entries.map((entry) => ({
      ...entry,
      month: Number(month),
      year: Number(year),
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

    const payrollEntries = await Payroll.find({
      month: Number(month),
      year: Number(year),
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
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Salary sheet entry not found" });
    }

    console.log("Updated entry:", updatedEntry);
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

    console.log("Deleted entry:", deletedEntry);
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