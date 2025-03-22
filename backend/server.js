const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/customer/userRoutes');
const plantRoutes = require('./routes/customer/plantRoutes');
const contactRoutes = require('./routes/customer/contactRoutes');
const jobRoutes = require("./routes/csm/jobRoutes");
const supportRoutes = require("./routes/customer/supportRoutes");
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const systemManagerRoutes = require('./routes/SM/smRoute');

// Add the GrowerHandler plant routes
const growerPlantRoutes = require('./routes/GrowerHandler/plantRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api', contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", supportRoutes);
app.use('/api/auth', authRoutes);
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use('/api/systemManagers', systemManagerRoutes);

// Add the new routes
app.use('/api/grower/plants', growerPlantRoutes); // For GrowerHandler plants
app.use('/api/tasks', jobRoutes); // For tasks (same as /api/jobs)

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));