import express from "express";
import { getDashboard } from "../controllers/reportController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getDashboard);

export default router;
