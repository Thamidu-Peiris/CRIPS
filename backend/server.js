const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import routes
const plantRoutes = require("./routes/GrowerHandler/plantRoutes");
const taskRoutes = require("./routes/GrowerHandler/tasks");

// Use routes
app.use("/api/plants", plantRoutes);
app.use('/api/tasks', taskRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
