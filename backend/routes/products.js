import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleAccess(["admin", "storekeeper"]), create);
router.get("/", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getAll);
router.get("/:id", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getOne);
router.put("/:id", roleAccess(["admin", "storekeeper"]), update);
router.delete("/:id", roleAccess(["admin"]), remove);

export default router;