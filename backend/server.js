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
const growerHandlerPlantRoutes = require('./routes/growerHandler/plantRoutes');
const supplierRoutes = require('./routes/SupplierM/SupplierRoute');
const stockRoutes = require('./routes/stockRoutes');

const growerPlantRoutes = require('./routes/growerHandler/plantRoutes');
const csmRoutes = require('./routes/csm/csmRoutes');



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

// Validate MongoDB URI
if (!MONGO_URI) {
  console.error(" Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

// Routes

app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/support", supportRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/grower-handler", growerHandlerPlantRoutes);


app.use('/api/grower/plants', growerHandlerPlantRoutes);
app.use('/api/systemManagers', systemManagerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stocks', stockRoutes);

// Add the new routes
app.use('/api/grower/plants', growerPlantRoutes); // For GrowerHandler plants
app.use('/api/tasks', jobRoutes); // For tasks (same as /api/jobs)
//csm routes
app.use('/api/csm', csmRoutes);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Global error-handling middleware
// Example placeholder route (remove if not needed)
// app.use('/api/grower/plants', growerPlantRoutes); // ⚠️ Define growerPlantRoutes if needed

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: err.message,
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

