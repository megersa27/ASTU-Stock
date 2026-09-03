import express from "express";
import {
  getAll,
  getOne,
  changeStock,
} from "../controllers/inventoryController.js";
import { getBinCardView } from "../controllers/stockController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head"]), getAll);
router.get("/:id", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head"]), getOne);
router.get("/:id/bin-card", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head"]), getBinCardView);
router.put("/:id/stock", roleAccess(["admin", "pao", "storekeeper"]), changeStock);

export default router;