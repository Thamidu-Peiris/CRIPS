const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Route Imports
const userRoutes = require('./routes/customer/userRoutes');
//const plantRoutes = require('./routes/customer/plantRoutes');
const contactRoutes = require('./routes/customer/contactRoutes');
const jobRoutes = require("./routes/jobRoutes");
const supportRoutes = require("./routes/customer/supportRoutes");
const authRoutes = require('./routes/authRoutes');
const systemManagerRoutes = require('./routes/SM/smRoute');
const growerHandlerPlantRoutes = require("./routes/GrowerHandler/plantRoutes");
const supplierRoutes = require('./routes/SupplierM/SupplierRoute');
const stockRoutes = require('./routes/InventoryM/StockRoute');
const stockPlantRoute = require('./routes/InventoryM/StockPlantRoute'); //(T)
const orderRoutes = require('./routes/customer/orderRoutes'); //Order
const couponRoutes = require('./routes/csm/couponRoutes'); //(T)

//const growerPlantRoutes = require('./routes/GrowerHandler/plantRoutes')
//const growerTaskRoutes = require('./routes/GrowerHandler/tasks'); //GH tasks
const environmentalDataRoutes = require('./routes/GrowerHandler/environmentalData');//GH env add data


const growerPlantRoutes = require('./routes/GrowerHandler/plantRoutes');
const growerTaskRoutes = require('./routes/GrowerHandler/tasks'); //GH tasks
const salesReportRoutes = require('./routes/SalesM/salesReportRoutes');
const csmRoutes = require('./routes/csm/csmRoutes');
const csmCustomerRoutes = require('./routes/csm/csmCustomerRoutes');
const visitorRoutes = require('./routes/SM/visitorRoutes');
const shipmentRoutes = require('./routes/TransportManager/shipmentRoutes');
const qualityRoutes = require('./routes//TransportManager/qualityRoutes');
const fuelRoutes = require('./routes/TransportManager/fuelRoutes');
const scheduleRoutes = require('./routes/TransportManager/scheduleRoutes');
const reportRoutes = require('./routes/TransportManager/reportRoutes');
const transportDashboardRoutes = require('./routes/TransportManager/transportDashboardRoutes');
const supplierDashboardRoutes = require('./routes/SupplierM/supplierDashboardRoutes');
const orderStockRoutes = require('./routes/SupplierM/orderStockRoutes');

//const emailRoutes = require('./routes/SM/emailRoutes');
const tmProfileRoutes = require('./routes/TransportManager/tmProfileRoutes');
const transportRoutes = require('./routes/TransportManager/transportRoutes');
const cusRoutes = require('./routes/SM/cusRouter');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.urlencoded({ extended: true })); // Added to parse FormData
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/grower/tasks', growerTaskRoutes);//GH tasks
app.use('/api/grower/environmental-data', environmentalDataRoutes);//GH add env data
app.use('/api/users', userRoutes);

app.use('/api', contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", supportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/transport', transportDashboardRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/orders', orderRoutes);

// Validate MongoDB URI
if (!MONGO_URI) {
  console.error(" Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

// Connect to MongoDB (removed duplicate connection)
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes (removed duplicates)
app.use('/api/users', userRoutes);

app.use('/api/contact', contactRoutes);

app.use("/api/support", supportRoutes);

app.use("/api/grower-handler", growerHandlerPlantRoutes);
app.use('/api/systemManagers', systemManagerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/grower/plants', growerPlantRoutes);
app.use('/api/grower/tasks', growerTaskRoutes); //GH tasks
app.use('/api/tasks', jobRoutes);
app.use('/api/sales', salesReportRoutes);
app.use('/api/csm', csmRoutes);
app.use('/api/csm/customers', csmCustomerRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/supplier-dashboard', supplierDashboardRoutes);
app.use('/api/order-stock', orderStockRoutes);
app.use('/api/inventory/plantstock', stockPlantRoute); //(T)
app.use('/api/sales', salesReportRoutes);

app.use('/api/csm', couponRoutes); //(T)


app.use('/api/transport-manager', tmProfileRoutes);
//app.use('/api/email', emailRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/smManageCustomer', cusRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: err.message,
  });
});