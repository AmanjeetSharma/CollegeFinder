import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  register,
  verify,
  login,
  logout,
  logoutAll,
  refresh,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Register
router.post("/register", register);

// Verify Email
router.get("/verify/:token", verify);

// Login
router.post("/login", login);

// Refresh Token
router.post("/refresh", refresh);

// Logout
router.post("/logout", verifyToken, logout);

// Logout all devices
router.post("/logout-all", verifyToken, logoutAll);

export default router;