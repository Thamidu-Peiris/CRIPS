const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Route Imports
const userRoutes = require('./routes/customer/userRoutes');
const plantRoutes = require('./routes/customer/plantRoutes');
const contactRoutes = require('./routes/customer/contactRoutes');
const jobRoutes = require("./routes/jobRoutes");
const supportRoutes = require("./routes/customer/supportRoutes");
const authRoutes = require('./routes/authRoutes');
const systemManagerRoutes = require('./routes/SM/smRoute');
const growerHandlerPlantRoutes = require("./routes/GrowerHandler/plantRoutes");
const supplierRoutes = require('./routes/SupplierM/SupplierRoute');
const stockRoutes = require('./routes/InventoryM/StockRoute');



//const growerPlantRoutes = require('./routes/GrowerHandler/plantRoutes')
//const growerTaskRoutes = require('./routes/GrowerHandler/tasks'); //GH tasks
const environmentalDataRoutes = require('./routes/GrowerHandler/environmentalData');//GH env add data


const growerPlantRoutes = require('./routes/GrowerHandler/plantRoutes');
const growerTaskRoutes = require('./routes/GrowerHandler/tasks'); //GH tasks
const salesReportRoutes = require('./routes/SalesM/salesReportRoutes');
const csmRoutes = require('./routes/csm/csmRoutes');
const csmCustomerRoutes = require('./routes/csm/csmCustomerRoutes');
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
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/grower/tasks', growerTaskRoutes);//GH tasks
app.use('/api/grower/environmental-data', environmentalDataRoutes);//GH add env data
app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api', contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", supportRoutes);
app.use('/api/auth', authRoutes);




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
app.use('/api/plants', plantRoutes);
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