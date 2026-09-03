import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/expenseController.js";

import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", roleAccess(["admin", "accountant", "pao"]), create);
router.get("/", roleAccess(["admin", "accountant", "pao", "dept_head"]), getAll);
router.get("/:id", roleAccess(["admin", "accountant", "pao", "dept_head"]), getOne);
router.put("/:id", roleAccess(["admin", "accountant"]), update);
router.delete("/:id", roleAccess(["admin"]), remove);

export default router;