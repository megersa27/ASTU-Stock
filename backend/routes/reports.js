import express from "express";
import {
  getDashboard,
  getInventory,
  getStockMovement,
  getLowStock,
  getFifo,
  getDamaged,
  getStockTaking,
  getAudit,
} from "../controllers/reportController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/dashboard", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getDashboard);
router.get("/inventory", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getInventory);
router.get("/stock-movement", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getStockMovement);
router.get("/low-stock", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "dept_head", "security_officer"]), getLowStock);
router.get("/fifo", roleAccess(["admin", "pao", "accountant"]), getFifo);
router.get("/damaged", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "security_officer"]), getDamaged);
router.get("/stock-taking", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "security_officer"]), getStockTaking);
router.get("/audit", roleAccess(["admin", "pao"]), getAudit);

export default router;