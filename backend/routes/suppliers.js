import express from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/supplierController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getAll);
router.get("/:id", roleAccess(["admin", "pao", "storekeeper", "stock_clerk", "accountant", "dept_head", "security_officer"]), getOne);
router.post("/", roleAccess(["admin", "storekeeper"]), create);
router.put("/:id", roleAccess(["admin", "storekeeper"]), update);
router.delete("/:id", roleAccess(["admin"]), remove);

export default router;
