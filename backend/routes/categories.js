import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleAccess(["admin", "storekeeper"]), create);
router.get("/", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head"]), getAll);
router.get("/:id", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head"]), getOne);
router.put("/:id", roleAccess(["admin", "storekeeper"]), update);
router.delete("/:id", roleAccess(["admin"]), remove);

export default router;