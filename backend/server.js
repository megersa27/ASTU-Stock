import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./config/db.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ASTU Stock Management API is running",
  });
});

app.get("/api/health/database", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      database: "PostgreSQL connected",
    });
  } catch (error) {
    next(error);
  }
});

// Error handler — must be after routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);