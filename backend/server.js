const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("ASTU Stock Management System API is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working",
    project: "ASTU Stock Management System"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});