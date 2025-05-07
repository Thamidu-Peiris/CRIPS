// backend\controllers\SalesManager\reportController.js
/* eslint-disable */
const Transaction = require("../../models/salesManager/FinancialModel");
const Payroll = require("../../models/salesManager/PayrollModel");
const Product = require("../../models/salesManager/ProductModel");
const CustomerOrder = require("../../models/customer/CustomerOrder");
const User = require("../../models/customer/User"); 

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

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: "startDate and endDate must be valid dates" });
    }

    const parsedStartDate = new Date(startDate + "T00:00:00Z");
    const parsedEndDate = new Date(endDate + "T23:59:59.999Z");

    // Fetch completed orders for top customers and total purchases
    const orders = await CustomerOrder.find({
      createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      status: "Completed",
    }).populate("userId", "firstName lastName");

    // Calculate top customers with orders above Rs. 100
    const customerPurchases = {};
    orders.forEach(order => {
      if (order.total > 100) {
        const customerId = order.userId?._id?.toString();
        const customerName = order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : "Unknown";
        if (customerId) {
          if (!customerPurchases[customerId]) {
            customerPurchases[customerId] = { name: customerName, totalPurchases: 0 };
          }
          customerPurchases[customerId].totalPurchases += order.total;
        }
      }
    });

    const topCustomers = Object.entries(customerPurchases)
      .map(([id, info]) => ({
        customerId: id,
        name: info.name,
        totalPurchases: info.totalPurchases,
      }))
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, 5);

    // Fetch new customers using the User model
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      status: "approved"
    });

    // Calculate total purchases
    const totalPurchases = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate order size distribution (send raw counts)
const orderSizeDistributionRaw = await CustomerOrder.aggregate([
  {
    $match: {
      createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
      status: "Completed",
    },
  },
  {
    $group: {
      _id: {
        $cond: [
          { $lt: ["$total", 1000] },
          "Small",
          {
            $cond: [
              { $lte: ["$total", 5000] },
              "Medium",
              "Large",
            ],
          },
        ],
      },
      count: { $sum: 1 },
    },
  },
]);

// Ensure all buckets are represented, even if their counts are 0
const buckets = [
  { name: "Small", count: 0 },
  { name: "Medium", count: 0 },
  { name: "Large", count: 0 },
];

orderSizeDistributionRaw.forEach(bucket => {
  const index = buckets.findIndex(b => b.name === bucket._id);
  if (index !== -1) {
    buckets[index].count = bucket.count;
  }
});

const orderSizeDistribution = buckets.map(bucket => ({
  name: bucket.name,
  value: bucket.count, // Send raw counts
}));
console.log("Order Size Distribution sent to frontend:", orderSizeDistribution);

    res.status(200).json({
      topCustomers,
      orderSizeDistribution,
      summary: {
        newCustomers,
        totalPurchases,
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

    const endDate = queryEndDate || new Date().toISOString().split("T")[0];
    const startDate = queryStartDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: "startDate and endDate must be valid dates" });
    }

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

    const salesLast7Days = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $unwind: "$items" },
      { $group: { _id: null, totalUnits: { $sum: "$items.quantity" } } },
    ]);
    responseData.summary.last7DaysUnits = salesLast7Days[0]?.totalUnits || 0;

    const revenueLastMonth = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "Completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    responseData.summary.lastMonthRevenue = revenueLastMonth[0]?.totalRevenue || 0;

    const totalOrders = await CustomerOrder.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: "Completed",
    });
    responseData.summary.totalOrders = totalOrders;

    const avgOrderValue = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "Completed" } },
      { $group: { _id: null, avgValue: { $avg: "$total" } } },
    ]);
    responseData.summary.avgOrderValue = avgOrderValue[0]?.avgValue || 0;

    const pendingOrders = await CustomerOrder.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: "Pending",
    });
    responseData.summary.pendingOrders = pendingOrders;

    const prevRevenue = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: "Completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const prevRevenueValue = prevRevenue[0]?.totalRevenue || 0;
    const currentRevenue = responseData.summary.lastMonthRevenue;
    responseData.summary.revenueGrowth = prevRevenueValue > 0
      ? ((currentRevenue - prevRevenueValue) / prevRevenueValue) * 100
      : currentRevenue > 0 ? 100 : 0;

    const orderStatusDistribution = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } },
    ]);
    responseData.orderStatusDistribution = orderStatusDistribution;

    const salesData = await CustomerOrder.aggregate([
      { $match: { createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }, status: "Completed" } },
      { $unwind: "$items" },
      { $group: { _id: "$items.plantName", unitsSold: { $sum: "$items.quantity" } } },
    ]);

    const topPlantsUnits = [];
    for (const sale of salesData) {
      const product = await Product.findOne({ name: { $regex: `^${sale._id}$`, $options: 'i' } });
      const price = product ? product.price : 0;
      topPlantsUnits.push({
        name: sale._id,
        unitsSold: sale.unitsSold,
        totalRevenue: sale.unitsSold * price,
      });
    }
    responseData.topPlantsUnits = topPlantsUnits.sort((a, b) => b.unitsSold - a.unitsSold);

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