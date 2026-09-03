import express from "express";

import {
  create,
  getAll,
  getOne,
} from "../controllers/saleController.js";

import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleAccess(["admin", "pao", "storekeeper"]), create);
router.get("/", roleAccess(["admin", "pao", "storekeeper", "accountant", "dept_head"]), getAll);
router.get("/:id", roleAccess(["admin", "pao", "storekeeper", "accountant", "dept_head"]), getOne);

export default router;