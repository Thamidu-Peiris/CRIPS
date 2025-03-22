const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/customer/userRoutes');
const plantRoutes = require('./routes/customer/plantRoutes');
const contactRoutes = require('./routes/customer/contactRoutes');
const jobRoutes = require("./routes/jobRoutes");
const supportRoutes = require("./routes/customer/supportRoutes");
const authRoutes = require('./routes/authRoutes');
const systemManagerRoutes = require('./routes/SM/smRoute');
const growerHandlerPlantRoutes = require("./routes/growerHandler/plantRoutes");
const supplierRoutes = require('./routes/supplierRoutes');
const stockRoutes = require('./routes/stockRoutes');


// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Validate MONGO_URI
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the .env file");
  process.exit(1); // Exit the process with failure
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if connection fails
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/contact', contactRoutes); // Distinct prefix for contactRoutes
app.use("/api/jobs", jobRoutes);
app.use("/api/support", supportRoutes); // Distinct prefix for supportRoutes
app.use('/api/auth', authRoutes);
app.use("/api/grower-handler", growerHandlerPlantRoutes);
app.use('/api/systemManagers', systemManagerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stocks', stockRoutes);

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});