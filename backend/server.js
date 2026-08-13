const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("ASTU Stock Management System API is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working",
    project: "ASTU Stock Management System"
  });
});

// Connect database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ASTU Stock backend is healthy"
  });
});