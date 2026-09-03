import express from "express";
import {
  create,
  getAll,
  getOne,
  approve,
  reject,
} from "../controllers/stockTakingController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleAccess(["admin", "storekeeper", "stock_clerk"]), create);
router.get("/", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "dept_head"]), getAll);
router.get("/:id", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "dept_head"]), getOne);
router.patch("/:id/approve", roleAccess(["admin", "pao", "dept_head"]), approve);
router.patch("/:id/reject", roleAccess(["admin", "pao", "dept_head"]), reject);

export default router;
