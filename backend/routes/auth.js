import express from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPasswordRequest,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordRequest);
router.get("/me", authMiddleware, getMe);

export default router;