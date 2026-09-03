import express from "express";
import {
  getAll,
  getOne,
  create,
  update,
  deactivate,
  approve,
  updateCurrentProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import roleAccess from "../middleware/roleAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleAccess(["admin", "pao"]), getAll);
router.get("/:id", roleAccess(["admin", "pao"]), getOne);
router.post("/", roleAccess(["admin"]), create);
router.patch("/me", authMiddleware, updateCurrentProfile);
router.put("/:id", roleAccess(["admin"]), update);
router.patch("/:id/approve", roleAccess(["admin"]), approve);
router.patch("/:id/deactivate", roleAccess(["admin"]), deactivate);

export default router;
