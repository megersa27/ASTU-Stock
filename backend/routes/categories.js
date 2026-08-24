import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;