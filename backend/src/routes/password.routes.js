import { verifyToken } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { changePassword } from "../controllers/password.controller.js";

const router = Router();

// CHANGE PASSWORD
router.post("/change-password", verifyToken, changePassword);

export default router;