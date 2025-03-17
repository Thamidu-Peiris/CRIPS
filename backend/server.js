const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import route files
const userRoutes = require('./routes/userRoutes');
const plantRoutes = require('./routes/plantRoutes');
const contactRoutes = require('./routes/contactRoutes');
const jobRoutes = require("./routes/jobRoutes");
const supportRoutes = require("./routes/supportRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api', contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", supportRoutes);

// Allow frontend to access backend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Test API Endpoint
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// New API Routes for Plants
const Plant = require('./models/Plant'); // Import the Plant model

// Create a New Plant
app.post('/api/plants/add', async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ message: "Error adding plant", error });
  }
});

// Get All Plants
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving plants", error });
  }
});

// Update Plant
app.put('/api/plants/update/:id', async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ message: "Error updating plant", error });
  }
});

// Delete Plant
app.delete('/api/plants/delete/:id', async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting plant", error });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
