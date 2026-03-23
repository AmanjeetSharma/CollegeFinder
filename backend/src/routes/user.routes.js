import { verifyToken } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {
    getProfile,
    updateProfile,
    getUserSessions,
    logoutSingleDevice
} from "../controllers/user.controller.js";

const router = Router();

// GET USER PROFILE
router.get("/profile", verifyToken, getProfile);

// UPDATE USER PROFILE
router.patch("/update-profile", verifyToken, updateProfile);

// GET USER SESSIONS
router.get("/sessions", verifyToken, getUserSessions);

// LOGOUT FROM SINGLE DEVICE
router.post("/sessions/logout/:sessionId", verifyToken, logoutSingleDevice);

export default router;