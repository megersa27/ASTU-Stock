import express from "express";
import { getAll, getOne } from "../controllers/auditController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleAccess(["admin", "pao"]), getAll);
router.get("/:id", roleAccess(["admin", "pao"]), getOne);

export default router;
