import express from "express";
import {
  handleReceive,
  handleIssue,
  handleTransfer,
  getHistory,
  getBinCardView,
} from "../controllers/stockController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/receive", roleAccess(["admin", "storekeeper"]), handleReceive);
router.post("/issue", roleAccess(["admin", "pao", "storekeeper"]), handleIssue);
router.post("/transfer", roleAccess(["admin", "pao", "storekeeper"]), handleTransfer);
router.get("/history", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getHistory);
router.get("/bin-card/:id", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getBinCardView);

export default router;
