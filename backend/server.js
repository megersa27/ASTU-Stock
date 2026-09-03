import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./config/db.js";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import inventoryRoutes from "./routes/inventory.js";
import supplierRoutes from "./routes/suppliers.js";
import warehouseRoutes from "./routes/warehouses.js";
import stockRoutes from "./routes/stock.js";
import stockTakingRoutes from "./routes/stockTaking.js";
import damagedRoutes from "./routes/damaged.js";
import userRoutes from "./routes/users.js";
import auditLogRoutes from "./routes/auditLogs.js";
import reportRoutes from "./routes/reports.js";
import expenseRoutes from "./routes/expenses.js";
import salesRoutes from "./routes/sales.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { seedDemoUsers } from "./services/userService.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];

      if (!origin || allowedOrigins.some((pattern) => pattern.test(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ASTU Stock Management API is running",
    timestamp: new Date().toISOString(),
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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/stock-takings", stockTakingRoutes);
app.use("/api/damaged", damagedRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/sales", salesRoutes);

// 404 Handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  try {
    await seedDemoUsers();
    console.log("Demo users seeded successfully");
  } catch (error) {
    console.error("Demo user seeding failed:", error.message);
  }

  console.log(`ASTU Stock Management Server running on http://localhost:${PORT}`);
});

export default app;