const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/customer/userRoutes');
const plantRoutes = require('./routes/customer/plantRoutes');
const contactRoutes = require('./routes/customer/contactRoutes');
const jobRoutes = require("./routes/csm/jobRoutes");
const supportRoutes = require("./routes/customer/supportRoutes");
const path = require('path'); // Import the path mo


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // Still okay to keep for now, but also deprecated in newer versions
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/users', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api', contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", supportRoutes);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));